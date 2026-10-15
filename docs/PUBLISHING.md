# 예약 발행 운영

AdSense 재신청 전까지 블로그는 **주 2편(화·금)**으로 발행한다. 근거와 결정 과정은 Drive `10_projects/floor05/261015_adsense-approval-research.md`에 있다.

## 원칙
- 하루에 한 편만 발행한다. 한꺼번에 몰아서 발행하지 않는다.
- `dateModified`는 본문을 실제로 바꾼 글만 갱신한다. 값은 발행일로 둔다.
- 게시물은 '실측 리포트' 포맷을 따른다: 측정 방법 공개, 결과 표, 직접 만든 시각 자료, 실측 숫자가 들어간 FAQ, 원자료(`docs/blog-data/`) 보관.

## 동작 방식
1. 글마다 `scheduled/YYYY-MM-DD-<slug>` 브랜치를 만든다. 날짜는 발행일(KST)이다.
2. 브랜치는 **직전 예약 브랜치 위에 쌓는다**. `blog.ts`를 여러 브랜치가 고쳐도 충돌이 나지 않게 하기 위해서다.
3. `.github/workflows/scheduled-publish.yml`이 화·금 09:00(KST)에 실행된다.
   - 날짜가 지난 브랜치 중 가장 이른 것 **하나**를 main에 병합한다.
   - lint, tsc, build를 통과하면 push하고 브랜치를 삭제한다. 그 push로 Vercel이 배포한다.
   - 실패하면 job이 실패로 남고 main은 바뀌지 않는다. GitHub Actions 탭에서 확인한다.
4. 수동 실행: GitHub Actions → Scheduled publish → Run workflow

## 예약 현황 확인
```bash
git fetch --prune && git branch -r --list 'origin/scheduled/*'
```

## main을 직접 고친 경우
쌓아둔 예약 브랜치는 병합 시점에 main과 자동으로 합쳐진다. 같은 줄을 고쳐 충돌이 나면 워크플로가 실패한다. 이때는 가장 이른 예약 브랜치부터 main 위로 rebase한 뒤 다시 push한다.
