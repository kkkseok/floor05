#!/usr/bin/env bash
# 작업 폴더 정리. 사용: bash cleanup.sh            (점검만, 아무것도 바꾸지 않음)
#                       bash cleanup.sh --apply    (SAFE로 분류된 것만 실행)
# 분류: SAFE(지워도/맞춰도 잃는 것 없음) · REVIEW(사람·모델 판단 필요, 절대 자동 처리 안 함) · KEEP(유지)
# 원격 브랜치 삭제, 미커밋 변경 폐기, force 계열은 이 스크립트가 하지 않는다.
set -u
APPLY=0; [ "${1:-}" = "--apply" ] && APPLY=1
cd "$(git rev-parse --show-toplevel)" || exit 1
ROOT=$(pwd -W 2>/dev/null || pwd)

safe=0; review=0
SAFE()   { echo "SAFE    $1"; safe=$((safe+1)); if [ $APPLY -eq 1 ]; then shift; "$@" >/dev/null 2>&1 && echo "        → done" || { echo "        → 실패 (REVIEW로 넘김)"; review=$((review+1)); }; fi; }
REVIEW() { echo "REVIEW  $*"; review=$((review+1)); }
KEEP()   { echo "KEEP    $*"; }

git fetch -q --prune origin || { echo "git fetch 실패 — 원격 비교가 틀릴 수 있어 중단"; exit 1; }
git worktree prune

cur=$(git branch --show-current)
echo "== 메인 작업 폴더 ($cur)"
d=$(git status --porcelain | grep -c . || true)
[ "$d" -eq 0 ] && KEEP "미커밋 변경 없음" || REVIEW "미커밋 변경 ${d}개 — 이 스크립트는 건드리지 않음 (git status 확인)"
ab=$(git rev-list --left-right --count "origin/$cur...$cur" 2>/dev/null)
[ -n "$ab" ] && KEEP "origin/$cur 대비 뒤처짐/앞섬: $ab"
n=$(git stash list | grep -c . || true)
[ "$n" -gt 0 ] && REVIEW "stash ${n}개 — 내용 확인 후 사용자에게 물을 것 (git stash list)"

echo "== 추가 작업 폴더 (worktree)"
while read -r w; do
  [ "$(cd "$w" && (pwd -W 2>/dev/null || pwd))" = "$ROOT" ] && continue
  name=$(basename "$w"); br=$(git -C "$w" branch --show-current); h=$(git -C "$w" rev-parse HEAD)
  dirty=$(git -C "$w" status --porcelain | grep -c . || true)
  inremote=$(git branch -r --contains "$h" | grep -c . || true)
  inmain=$(git merge-base --is-ancestor "$h" origin/main && echo 1 || echo 0)
  lockf="$(git rev-parse --git-common-dir)/worktrees/$name/locked"
  lock=""; stale=1
  if [ -f "$lockf" ]; then
    lock=$(cat "$lockf"); pid=$(echo "$lock" | grep -oiE 'pid[^0-9]*[0-9]+' | grep -oE '[0-9]+' | head -1)
    if [ -n "$pid" ] && tasklist //FI "PID eq $pid" 2>/dev/null | grep -q " $pid "; then stale=0; fi
    [ -z "$pid" ] && stale=0   # 사유에 PID가 없으면 누가 잡았는지 모름 → 판단 보류
  fi
  desc="$name [$br] dirty=$dirty 원격포함=$inremote main포함=$inmain${lock:+ lock=\"$lock\"}"
  if [ "$dirty" -gt 0 ]; then REVIEW "$desc — 미커밋 변경 있음"
  elif [ $stale -eq 0 ]; then REVIEW "$desc — 잠금 프로세스가 살아 있거나 불명 (작업 중인 에이전트일 수 있음)"
  elif [ "$inremote" -eq 0 ] && [ "$inmain" -eq 0 ]; then REVIEW "$desc — HEAD가 어느 원격 브랜치에도 없음 (옮겨 담은 브랜치와 파일별 대조 필요)"
  else SAFE "$desc — 변경 없음, 커밋은 원격에 보존됨" sh -c "git worktree unlock '$w' 2>/dev/null; git worktree remove --force '$w'"
  fi
done < <(git worktree list --porcelain | awk '/^worktree /{print substr($0,10)}')

echo "== 로컬 브랜치"
for b in $(git branch --format='%(refname:short)'); do
  [ "$b" = "$cur" ] && continue
  if git worktree list --porcelain | grep -qx "branch refs/heads/$b"; then KEEP "$b — 작업 폴더가 쓰는 중 (위 worktree 처리 후 다시 실행)"; continue; fi
  if git rev-parse -q --verify "origin/$b" >/dev/null; then
    set -- $(git rev-list --left-right --count "$b...origin/$b")   # $1=로컬만 $2=원격만
    if [ "$1" -gt 0 ]; then REVIEW "$b — push 안 된 로컬 커밋 $1개"
    elif [ "$2" -gt 0 ]; then SAFE "$b — 원격보다 $2개 뒤처짐 → fast-forward" git fetch -q origin "$b:$b"
    elif git merge-base --is-ancestor "$b" origin/main; then SAFE "$b — main에 병합됨, 원격과 같음 → 로컬 사본만 삭제 (원격 유지)" git branch -d "$b"
    else KEEP "$b — 원격과 같음, 아직 main에 안 들어감"
    fi
  else
    if git merge-base --is-ancestor "$b" origin/main; then SAFE "$b — main에 병합됨, 원격 없음 → 삭제" git branch -d "$b"
    else REVIEW "$b — 원격에 없고 main에도 없음 (로컬에만 있는 작업일 수 있음)"
    fi
  fi
done

echo "== 원격 브랜치 (보고만)"
for r in $(git branch -r --format='%(refname:short)' | grep -v -e '^origin/HEAD$' -e '^origin/main$' -e '^origin/scheduled/' -e '^origin$'); do
  git merge-base --is-ancestor "$r" origin/main && REVIEW "$r — main에 병합됨. 원격 삭제는 사용자 승인 필요"
done

echo "== 무시된 생성물"
for p in test-results playwright-report blob-report; do
  [ -e "$p" ] && SAFE "$p/ ($(du -sh "$p" | cut -f1)) — E2E 결과물, 테스트하면 다시 생김" rm -rf "$p"
done
for p in .next tests/fixtures/generated .claude/scheduled_tasks.lock; do
  [ -e "$p" ] && KEEP "$p — 빌드 캐시/테스트 입력/세션 예약 잠금"
done

[ $APPLY -eq 0 ] && mode="점검만 (적용: --apply)" || mode="적용함"
echo "SUMMARY: SAFE=$safe REVIEW=$review — $mode"
