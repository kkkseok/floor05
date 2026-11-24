---
name: workspace-cleanup
description: "floor05 저장소의 작업 폴더(git worktree)·로컬 브랜치·테스트 생성물을 잃는 것 없이 정리할 때 사용. '작업 폴더 정리해줘', '브랜치 정리', 'worktree 정리', '에이전트 작업 폴더 지워줘' 요청 시 따른다. 지워도 되는 것만 지우고, 판단이 필요한 것은 근거를 붙여 보고한다."
---

# 작업 폴더 정리 (floor05)

원칙: **잃는 것이 없음을 확인한 것만 지운다.** 확인이 안 되면 지우지 않고 보고한다.

## 1. 점검 → 적용

```bash
bash .claude/skills/workspace-cleanup/scripts/cleanup.sh            # 점검만 (아무것도 바꾸지 않음)
bash .claude/skills/workspace-cleanup/scripts/cleanup.sh --apply    # SAFE만 실행
```

먼저 점검만 돌려 결과를 읽고, SAFE 목록이 예상과 맞을 때 `--apply`를 돌린다. 적용한 뒤에는 점검을 한 번 더 돌려 SAFE가 0인지 확인한다. 작업 폴더를 지우면 그 폴더가 쓰던 브랜치가 그제야 SAFE로 바뀌므로, 두 번 돌려야 끝나는 경우가 있다.

### 분류 기준 (스크립트가 판정)

| 대상 | SAFE (자동 처리) | REVIEW (자동 처리 안 함) |
|---|---|---|
| 추가 작업 폴더 | 미커밋 변경 0, HEAD가 원격 브랜치나 main에 들어 있음, 잠금이 없거나 잠근 PID가 죽음 → 잠금 해제 후 삭제 | 미커밋 변경 있음 / 잠근 프로세스가 살아 있거나 PID 불명 / HEAD가 어디에도 없음 |
| 로컬 브랜치 (원격 있음) | 원격보다 뒤처지기만 함 → fast-forward. main에 병합됐고 원격과 같음 → 로컬 사본만 `-d` 삭제 | push 안 된 로컬 커밋 있음 |
| 로컬 브랜치 (원격 없음) | main에 병합됨 → `-d` 삭제 | main에도 없음 (로컬에만 있는 작업) |
| 생성물 | `test-results/`, `playwright-report/`, `blob-report/` | — |
| 메인 작업 폴더 | — | 미커밋 변경, stash |
| 원격 브랜치 | — | main에 병합된 원격 브랜치(보고만) |

항상 KEEP인 것:
- `.next/`: 빌드 캐시
- `tests/fixtures/generated/`: 테스트 입력
- `.claude/scheduled_tasks.lock`: 세션 예약 작업의 잠금
- 아직 main에 들어가지 않은 `scheduled/*`: 발행 대기 중인 예약 브랜치

## 2. REVIEW 항목 처리

각 항목을 확인한 뒤, 잃는 것이 없다는 근거를 붙여서 처리하거나 사용자에게 묻는다.

- **HEAD가 어디에도 없는 작업 폴더나 브랜치**: 에이전트 초안(`draft/*`, `worktree-agent-*`)은 예약 브랜치로 옮겨 담으면서 커밋이 새로 만들어지는 경우가 많다. 그래서 커밋이 아니라 **파일 내용**으로 대조한다.
  ```bash
  for f in $(git diff --name-only $(git merge-base <draft> origin/main) <draft>); do
    git diff --quiet <draft> origin/scheduled/<날짜-slug> -- "$f" && echo "same $f" || echo "DIFF $f"; done
  ```
  - `src/lib/common/blog.ts`는 여러 글이 함께 고치는 파일이라, 해당 글 항목만 잘라서 비교한다. `dateModified`가 다른 것은 정상이다.
  - 모두 같으면 근거를 보고하고 `git worktree remove --force`와 `git branch -D`로 지운다.
  - 하나라도 DIFF면 지우지 않고 무엇이 다른지 보고한다.
- **잠금이 살아 있는 작업 폴더**: 이 세션의 에이전트라면 작업이 끝났는지 먼저 확인한다(TaskStop이나 완료 알림). 다른 세션이 잠근 것이면 지우지 않는다.
- **메인 작업 폴더의 미커밋 변경, stash**: 내용을 요약해 보고만 한다. 버리거나 커밋할지는 사용자가 정한다.
- **push 안 된 로컬 커밋**: 커밋 목록을 보고하고, push할지 버릴지 묻는다.
- **원격 브랜치 삭제**: 바깥에 남는 행동이라 반드시 사용자 승인을 받는다.

## 3. 하지 않는 것

- 원격 브랜치 삭제, force push, `git reset --hard`, `git clean -fdx`, 미커밋 변경 폐기는 사용자 승인 없이 하지 않는다.
- `node_modules/`, `.next/`, `.vercel/`, `.env*`는 정리 대상이 아니다.

## 보고 형식

두괄식으로 쓴다.
1. 첫 줄: 정리 후 상태. 예: "작업 폴더는 main 하나, origin/main과 같음, 미커밋 변경 없음"
2. 지운 것 / 맞춘 것: 개수와 이름, 각각 잃는 것이 없다는 근거(병합됨, 원격과 같음, 파일별 대조 일치)
3. 그대로 둔 것과 이유
4. 사용자 결정이 필요한 것(REVIEW)

## 알려진 함정

- **Windows 경로**: `git worktree list`는 `C:/...` 형식이고 bash의 `pwd`는 `/c/...` 형식이다. 메인 폴더를 비교할 때는 `pwd -W`를 쓴다(스크립트가 처리함).
- **`git branch -d`가 거부할 때**: 현재 브랜치(main)에 병합되지 않았다는 뜻이다. `-D`로 바꾸지 말고 REVIEW로 다룬다.
- **잠금 사유의 PID**: 이 세션의 에이전트가 건 잠금은 사유에 PID가 들어 있다. `tasklist //FI "PID eq <pid>"`로 그 프로세스가 살아 있는지 확인한다.
- **파이프 안의 카운터**: `... | while read`는 서브셸에서 돌아서 카운터가 바깥으로 전달되지 않는다. 스크립트는 `done < <(...)` 형태로 돌린다.
