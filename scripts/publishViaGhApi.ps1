$ErrorActionPreference = 'Stop'

$repo = 'Wang-peng-eng/ai-content-insight-workbench'
$message = 'Build V1 content insight workbench'
$files = git ls-files

if (-not $files) {
  throw 'No tracked files found to publish.'
}

$tree = @()

foreach ($file in $files) {
  $fullPath = Join-Path (Get-Location) $file
  $bytes = [System.IO.File]::ReadAllBytes($fullPath)
  $content = [Convert]::ToBase64String($bytes)
  $blobBody = @{
    content = $content
    encoding = 'base64'
  } | ConvertTo-Json -Compress

  $blob = $blobBody | gh api "repos/$repo/git/blobs" --method POST --input - | ConvertFrom-Json
  $tree += @{
    path = $file.Replace('\', '/')
    mode = '100644'
    type = 'blob'
    sha = $blob.sha
  }
}

$treeBody = @{ tree = $tree } | ConvertTo-Json -Depth 8 -Compress
$createdTree = $treeBody | gh api "repos/$repo/git/trees" --method POST --input - | ConvertFrom-Json

$parentSha = $null
try {
  $currentRef = gh api "repos/$repo/git/ref/heads/main" | ConvertFrom-Json
  $parentSha = $currentRef.object.sha
} catch {
  $parentSha = $null
}

$commitPayload = @{
  message = $message
  tree = $createdTree.sha
}

if ($parentSha) {
  $commitPayload.parents = @($parentSha)
}

$commitBody = $commitPayload | ConvertTo-Json -Depth 5 -Compress
$commit = $commitBody | gh api "repos/$repo/git/commits" --method POST --input - | ConvertFrom-Json

if ($parentSha) {
  @{ sha = $commit.sha; force = $true } |
    ConvertTo-Json -Compress |
    gh api "repos/$repo/git/refs/heads/main" --method PATCH --input - | Out-Null
} else {
  @{ ref = 'refs/heads/main'; sha = $commit.sha } |
    ConvertTo-Json -Compress |
    gh api "repos/$repo/git/refs" --method POST --input - | Out-Null
}

Write-Output $commit.sha
