# 블로그 실측용: 루트 프로세스와 그 자손 전체(브라우저의 모든 프로세스)의 메모리를 주기적으로 합산해 최대치를 기록한다.
# 작업 관리자 수준의 근사치다. WorkingSetSize(작업 집합)와 PrivatePageCount(커밋된 개인 메모리, 작업 관리자 '커밋 크기')를
# Win32_Process 에서 읽어 자손 전체를 더한다. <StopFile> 이 생기면 멈추고 <Out> 에 JSON 을 쓴다.
# 사용: pwsh -NoProfile -File proc-mem-sampler.ps1 -RootPid <pid> -Out <json> -StopFile <path> [-IntervalMs 500]
param([int]$RootPid, [string]$Out, [string]$StopFile, [int]$IntervalMs = 500)
$samples = New-Object System.Collections.Generic.List[object]
$maxWs = 0; $maxPriv = 0; $maxProcs = 0
$t0 = Get-Date
while (-not (Test-Path $StopFile)) {
  $all = Get-CimInstance Win32_Process -Property ProcessId, ParentProcessId, WorkingSetSize, PrivatePageCount
  $children = @{}
  foreach ($p in $all) { if (-not $children.ContainsKey([int]$p.ParentProcessId)) { $children[[int]$p.ParentProcessId] = New-Object System.Collections.Generic.List[object] }; $children[[int]$p.ParentProcessId].Add($p) }
  $byId = @{}; foreach ($p in $all) { $byId[[int]$p.ProcessId] = $p }
  $stack = New-Object System.Collections.Generic.Stack[int]; $stack.Push($RootPid)
  $ws = 0; $priv = 0; $n = 0; $seen = @{}
  while ($stack.Count -gt 0) {
    $id = $stack.Pop(); if ($seen.ContainsKey($id)) { continue }; $seen[$id] = $true
    if ($byId.ContainsKey($id)) { $ws += [double]$byId[$id].WorkingSetSize; $priv += [double]$byId[$id].PrivatePageCount; $n++ }
    if ($children.ContainsKey($id)) { foreach ($c in $children[$id]) { $stack.Push([int]$c.ProcessId) } }
  }
  $osm = Get-CimInstance Win32_OperatingSystem -Property FreePhysicalMemory
  $s = [ordered]@{ t = [math]::Round(((Get-Date) - $t0).TotalSeconds, 1); wsMB = [math]::Round($ws / 1MB); privateMB = [math]::Round($priv / 1MB); procs = $n; freeMB = [math]::Round($osm.FreePhysicalMemory / 1024) }
  $samples.Add($s)
  if ($ws -gt $maxWs) { $maxWs = $ws }; if ($priv -gt $maxPriv) { $maxPriv = $priv }; if ($n -gt $maxProcs) { $maxProcs = $n }
  Start-Sleep -Milliseconds $IntervalMs
}
$minFree = ($samples | ForEach-Object { $_.freeMB } | Measure-Object -Minimum).Minimum
$res = [ordered]@{ method = "Win32_Process 자손 합산(WorkingSetSize, PrivatePageCount), $IntervalMs ms 간격"; rootPid = $RootPid; maxWorkingSetMB = [math]::Round($maxWs / 1MB); maxPrivateMB = [math]::Round($maxPriv / 1MB); maxProcs = $maxProcs; minSystemFreeMB = $minFree; samples = $samples.Count; series = $samples }
$res | ConvertTo-Json -Depth 4 | Set-Content -Path $Out -Encoding utf8
