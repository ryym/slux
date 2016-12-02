import test from 'ava';

test.todo('installSubStores');
test.todo('onMutation');
test.todo('onAction');
test.todo('takeSnapshot');

// 考えたらここが一番核の部分。
// 下記のようなテストは単体テストではなく結合テスト？
// - 状態変更に応じて通知を受け取れる
// - サブストアの状態変更も通知される
// - サブストアを含めたsnapshot
// - getters, mutations, actions の階層構造 (no grand child)
// - mutationが値を返すとそれがnext stateになる
//
// examplesの複雑なものには単体テストも含める (例としての意味でも)
// それとは別にE2Eテストも？
