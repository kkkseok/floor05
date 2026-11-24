#!/usr/bin/env bash
# 예약 발행 결과 점검. 사용: bash check-publish.sh [YYYY-MM-DD]  (기본: 오늘 KST)
# 읽기 전용이다. push·브랜치 삭제·수동 실행을 하지 않는다.
# 마지막 줄 RESULT: PASS | NOT_RUN | FAIL, exit code 0 | 2 | 1
set -u
export PYTHONIOENCODING=utf-8
REPO=kkkseok/floor05
SITE=https://www.floor05.com
D=${1:-$(TZ=KST-9 date +%F)}
cd "$(git rev-parse --show-toplevel)" || exit 1

fail=0
ok()  { echo "PASS  $*"; }
bad() { echo "FAIL  $*"; fail=1; }
info(){ echo "INFO  $*"; }

git fetch -q --prune origin || { bad "git fetch 실패"; }

# 1) 그날(KST) 실행 기록. KST D일 = UTC D-1 15:00 ~ D 15:00
from=$(date -u -d "$D 00:00 +0900" +%FT%TZ)
to=$(date -u -d "$D 00:00 +0900 +1 day" +%FT%TZ)
runs=$(gh run list -R $REPO --workflow "Scheduled publish" --limit 20 \
  --json databaseId,createdAt,event,status,conclusion \
  --jq ".[] | select(.createdAt >= \"$from\" and .createdAt < \"$to\") | \"\(.databaseId) \(.createdAt) \(.event) \(.status) \(.conclusion)\"")
echo "== 실행 기록 ($D KST)"
if [ -z "$runs" ]; then
  info "실행 기록 없음 (마지막 실행: $(gh run list -R $REPO --workflow 'Scheduled publish' --limit 1 --json createdAt,conclusion --jq '.[0] | "\(.createdAt) \(.conclusion)"'))"
else
  echo "$runs" | while read -r id at ev st co; do
    kst=$(TZ=KST-9 date -d "$at" '+%H:%M')
    echo "      run $id  $kst KST  $ev  $st/$co"
  done
  echo "$runs" | awk '$4!="completed"{e=1} END{exit e}' || info "아직 진행 중인 실행이 있음"
  echo "$runs" | awk '$4=="completed" && $5!="success"{e=1} END{exit e}' || bad "실패한 실행이 있음 (gh run view <id> --log-failed)"
fi

# 2) main 병합 커밋 (그날 브랜치)
echo "== main 병합"
pubs=$(git log origin/main --format='%h %s' --grep="^publish: scheduled/$D-")
n=$(printf '%s' "$pubs" | grep -c . || true)
if [ "$n" -eq 0 ]; then
  if [ -z "$runs" ]; then echo "RESULT: NOT_RUN"; exit 2; fi
  bad "그날 발행 커밋 없음 (실행은 있었음 → 로그 확인)"
  echo "RESULT: FAIL"; exit 1
fi
[ "$n" -eq 1 ] && ok "발행 커밋 1개: $pubs" || bad "발행 커밋 ${n}개 (하루 1편 원칙 위반?): $pubs"
today_pubs=$(git log origin/main --since="$D 00:00 +0900" --until="$D 23:59:59 +0900" --grep='^publish: scheduled/' --format='%s' | grep -c . || true)
[ "$today_pubs" -le 1 ] && ok "그날 발행 총 ${today_pubs}편" || info "그날 발행 총 ${today_pubs}편 (밀린 글 따라잡기였는지 확인)"
sha=$(echo "$pubs" | head -1 | awk '{print $1}')
branch=$(echo "$pubs" | head -1 | sed 's/^[^ ]* publish: //')
slug=${branch#scheduled/$D-}
git branch -r | grep -q "origin/$branch$" && bad "원격 브랜치 남아 있음: $branch" || ok "원격 브랜치 삭제됨: $branch"

# 3) Vercel (statuses 목록은 이력이라 pending이 섞인다 → 합산 status 사용)
echo "== Vercel"
vs=$(gh api repos/$REPO/commits/$sha/status --jq '.state + " | " + ([.statuses[] | .context + ": " + .description] | join(", "))')
case "$vs" in success*) ok "배포 $vs";; pending*) info "배포 진행 중 $vs";; *) bad "배포 $vs";; esac

# 4) 운영 페이지
echo "== 운영 페이지 /blog/$slug"
tmp=$(mktemp)
code=$(curl -s -o "$tmp" -w '%{http_code}' "$SITE/blog/$slug")
[ "$code" = 200 ] && ok "페이지 200" || bad "페이지 $code"
expected_title=$(git show "$sha:src/lib/common/blog.ts" | python -X utf8 -c "
import sys,re; s=sys.stdin.read(); i=s.find('slug: \"$slug\"')
m=re.search(r'title:\s*\"([^\"]+)\"', s[i:]) if i>=0 else None; print(m.group(1) if m else '')")
python -X utf8 - "$tmp" <<'EOF'
import re,sys
h=open(sys.argv[1],encoding='utf-8',errors='replace').read()
t=re.search(r'<title>(.*?)</title>',h,re.S); h1=re.search(r'<h1[^>]*>(.*?)</h1>',h,re.S)
print('      title:', t.group(1) if t else '(없음)')
print('      h1   :', re.sub('<[^>]+>','',h1.group(1)) if h1 else '(없음)')
EOF
info "blog.ts 제목(참고): $expected_title"
imgs=$(grep -o "/images/blog/$slug/[^\"' )\]*" "$tmp" | sort -u)
if [ -z "$imgs" ]; then info "본문 이미지 없음 (/images/blog/$slug/)"; fi
for p in $imgs; do
  c=$(curl -s -o /dev/null -w '%{http_code}' "$SITE$p")
  [ "$c" = 200 ] && ok "이미지 200 $p" || bad "이미지 $c $p"
done
rm -f "$tmp"
lm=$(curl -s "$SITE/sitemap.xml" | python -X utf8 -c "import sys,re; m=re.search(r'/blog/$slug</loc>\s*<lastmod>([^<]+)',sys.stdin.read()); print(m.group(1) if m else '')")
[ "${lm:0:10}" = "$D" ] && ok "sitemap lastmod $lm" || bad "sitemap lastmod '$lm' (기대 $D)"

# 5) 남은 예약 브랜치 순차 병합 시뮬레이션 (ref를 만들지 않는 merge-tree)
echo "== 남은 예약 브랜치 병합 시뮬레이션"
base=$(git rev-parse origin/main); cnt=0
for b in $(git branch -r --format='%(refname:short)' | grep '^origin/scheduled/' | sort); do
  out=$(git merge-tree --write-tree --name-only "$base" "$b" 2>&1)
  if [ $? -eq 0 ]; then
    base=$(git commit-tree "$(echo "$out" | head -1)" -p "$base" -p "$b" -m sim); cnt=$((cnt+1))
  else
    bad "충돌 $b: $(echo "$out" | sed -n '2,4p' | tr '\n' ' ')"
  fi
done
ok "충돌 없이 병합 ${cnt}개 / 남은 예약 브랜치 $(git branch -r | grep -c 'origin/scheduled/')개"

if [ $fail -eq 0 ]; then echo "RESULT: PASS"; exit 0; else echo "RESULT: FAIL"; exit 1; fi
