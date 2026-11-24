---
name: publish-check
description: "floor05 블로그 예약 발행(화·금 GitHub Actions 'Scheduled publish')이 제대로 됐는지 확인하고, 실행이 늦거나 빠졌을 때 진단·재확인 예약까지 할 때 사용. '예약 발행 결과 확인해줘', '오늘 발행 됐어?', '금요일 발행 확인 예약해줘', '발행이 안 됐어' 요청 시 따른다. 글 작성·예약 브랜치 만들기는 measured-blog-post 스킬."
---

# 예약 발행 결과 확인 (floor05)

발행 구조는 `docs/PUBLISHING.md`에 있다. 화·금 KST 08:17에 본 실행, 12:43에 보조 실행이 돈다. 날짜가 된 `scheduled/YYYY-MM-DD-<slug>` 중 가장 이른 것 하나를 main에 병합하고, lint·tsc·build를 통과하면 push한다. Vercel은 그 push로 배포한다.

## 1. 점검 실행

```bash
bash .claude/skills/publish-check/scripts/check-publish.sh [YYYY-MM-DD]   # 기본: 오늘(KST)
```

읽기 전용이다. 스크립트가 확인하는 것:
1. 그날(KST) 'Scheduled publish' 실행 기록 전부: 시각(KST), 트리거(schedule/workflow_dispatch), 결과
2. `origin/main`의 `publish: scheduled/<날짜>-<slug>` 병합 커밋이 정확히 1개인지, 원격 예약 브랜치가 삭제됐는지
3. 그 커밋의 Vercel 배포 상태
4. 운영 `/blog/<slug>`: 200 응답, title·h1, 본문 이미지(`/images/blog/<slug>/`) 200, sitemap lastmod = 발행일
5. 남은 예약 브랜치를 새 main 위에 차례로 병합해 보는 시뮬레이션(`git merge-tree`). ref나 push를 만들지 않는다.

마지막 줄과 exit code로 판정한다:

| RESULT | exit | 뜻 | 다음 행동 |
|---|---|---|---|
| PASS | 0 | 발행·배포·반영 모두 정상 | 보고하고 끝낸다 |
| NOT_RUN | 2 | 그날 실행 기록도, 발행 커밋도 없음 | 2번 절차 |
| FAIL | 1 | 무언가 실패함(FAIL 줄 참고) | 3번 절차 |

- `INFO 배포 진행 중`: 몇 분 뒤 다시 돌린다.
- `INFO blog.ts 제목`: 참고용이다. 운영 title은 SEO 제목(`metadata.title`)이라 blog.ts 제목과 다를 수 있다. 사람이 읽고 맞는지 판단한다.

## 2. NOT_RUN (아직 안 돌았음)

GitHub 예약 실행은 몇 시간씩 늦는 게 흔하다. 정각 실행 시절 실측 지연은 4~7.5시간이었다(2026-11-24 화요일은 09:00 예정이 16:35에 돌았다).

1. 원인 점검은 한 번에 끝낸다. 하나라도 이상하면 그게 원인이다.
   ```bash
   gh repo view kkkseok/floor05 --json visibility,isArchived,pushedAt
   gh api repos/kkkseok/floor05/actions/workflows/385530102 --jq .state      # active여야 함
   gh api repos/kkkseok/floor05/actions/permissions                         # enabled:true
   git log -3 --format='%h %ad %s' -- .github/workflows/                    # 최근 수정으로 cron이 바뀌었나
   curl -s https://www.githubstatus.com/api/v2/incidents/unresolved.json    # GitHub 장애
   ```
   - public 저장소는 60일 동안 활동이 없으면 예약 실행이 자동으로 꺼진다(`state`가 `disabled_inactivity`).
   - 위 항목이 모두 정상이면 GitHub 쪽 지연이다. 설정을 건드리지 않는다.
2. 재확인 예약: CronCreate로 일회성(`recurring: false`) 작업을 1시간 뒤에 건다. 분은 정각·30분을 피한다. 프롬프트는 "publish-check 스킬로 <날짜> 예약 발행 확인, 아직이면 1시간 뒤 재예약(최대 18시대까지)".
3. 18시대에도 NOT_RUN이면 진단 결과와 함께 **수동 실행을 할지 사용자에게 묻는다.** 수동 실행은 운영 발행이라 묻지 않고 하지 않는다.

## 3. FAIL

- **실행 실패**: `gh run view <id> -R kkkseok/floor05 --log-failed`로 실패한 단계(병합 충돌, lint, tsc, build)를 확인한다. 이때 main은 바뀌지 않았다. 충돌이면 `docs/PUBLISHING.md`의 "main을 직접 고친 경우" 절차를 따른다(rebase 후 push하기 전에 사용자 확인).
- **발행 커밋 2개 이상**: 보조 실행이 밀린 글을 따라잡은 경우일 수 있다. 실행 기록과 브랜치 날짜를 보고 의도한 동작이었는지 보고한다.
- **Vercel 실패**: 커밋 status의 target_url을 열어 빌드 로그를 확인한다.
- **페이지·이미지·sitemap**: 배포 직후라면 CDN 반영을 몇 분 기다려 한 번 더 돌린다. 그래도 실패하면 원인을 보고한다.
- **시뮬레이션 충돌**: 다음 발행일 전에 해당 예약 브랜치를 main 위로 rebase해야 한다. 어느 브랜치에서 무엇이 충돌하는지 보고하고, rebase와 force push는 사용자 확인 후에 한다.

## 4. 수동 실행 (사용자가 승인했을 때만)

```bash
gh workflow run "Scheduled publish" -R kkkseok/floor05 --ref main
gh run list -R kkkseok/floor05 --workflow "Scheduled publish" --limit 1 --json databaseId --jq '.[0].databaseId'
gh run watch <id> -R kkkseok/floor05 --exit-status --interval 20
```

- 실행이 끝날 때까지 **main에 push하지 않는다.** 실행 안에서 하는 `git push origin main`이 거부된다.
- 끝나면 1번 스크립트로 다시 판정한다.
- 수동 발행 뒤에 늦은 예약 실행이 와도 괜찮다. 오늘 날짜까지 남은 브랜치가 없으면 "발행할 예약 브랜치가 없습니다"를 출력하고 끝난다(11/24 실측).

## 5. 미래 발행일 확인 예약

"금요일 발행 확인 예약해줘" 같은 요청이면 CronCreate로 일회성 작업을 건다.
- **시각**: 발행일 14:23 KST. 보조 실행(12:43)이 끝났을 시각이다.
- **프롬프트**: "publish-check 스킬로 YYYY-MM-DD 예약 발행 결과 확인. NOT_RUN이면 2번 절차, 수동 실행은 묻고 할 것."
- 이 예약은 세션 안에서만 돈다. 세션을 닫으면 사라진다고 사용자에게 알린다.

## 보고 형식

두괄식으로 쓴다. 첫 줄에 RESULT와 발행된 글(slug)을 쓰고, 그다음 다섯 항목을 한 줄씩 쓴다. 실행 시각은 예정 시각 대비 지연과 함께 KST로 적는다. 확인하지 못한 항목은 확인하지 못했다고 쓴다.

## 알려진 함정

- **Git Bash 시간대**: `TZ=Asia/Seoul`이 무시되고 UTC로 계산된다. `TZ=KST-9`를 쓴다.
- **커밋 status**: `commits/<sha>/statuses`는 이력 목록이라 pending과 success가 같이 나온다. 판정에는 합산 값인 `commits/<sha>/status`의 `.state`를 쓴다.
- **Vercel "Canceled by Ignored Build Step"**: 앱 코드가 아닌 커밋(워크플로·문서)은 빌드를 건너뛴다. 정상이다.
- **본문 이미지 경로**: `/images/blog/<slug>/`에 있다. HTML 안 RSC 데이터에는 같은 경로가 `\` 붙은 형태로 한 번 더 나온다(스크립트가 거른다).
- **PowerShell·cp949 출력 오류**: python 출력은 `-X utf8` 또는 `PYTHONIOENCODING=utf-8`로 돌린다.
- **과거 날짜 점검**: 나중에 그 글을 리라이트해서 `dateModified`가 바뀌면 sitemap 항목이 FAIL로 나온다. 정상이다.
