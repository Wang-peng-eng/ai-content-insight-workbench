import assert from 'node:assert/strict'
import { analyzeComments } from '../src/lib/analyzeComments.js'
import { buildTitleSuggestions, buildTopicSuggestions, buildUserProfile } from '../src/lib/generateSuggestions.js'
import { parseComments } from '../src/lib/parseComments.js'

const input = `
我35岁了，现在学AI还来得及吗？
我35岁了，现在学AI还来得及吗？

真的很怕被AI替代，工作越来越不稳定。
想转行AI但不知道从哪里开始。
工资不涨，想靠AI副业赚钱。
`

const parsed = parseComments(input)
assert.equal(parsed.originalCount, 5)
assert.equal(parsed.uniqueCount, 4)
assert.equal(parsed.duplicateCount, 1)

const analysis = analyzeComments(parsed.comments)
assert.ok(analysis.rankedAnxieties.length >= 3)
assert.equal(analysis.rankedAnxieties[0].count >= 1, true)

const profile = buildUserProfile(analysis)
assert.ok(profile.age)
assert.ok(profile.occupation)
assert.ok(profile.traits.length > 0)

assert.equal(buildTopicSuggestions(analysis).length, 10)
assert.equal(buildTitleSuggestions(analysis).length, 10)

console.log('smoke tests passed')
