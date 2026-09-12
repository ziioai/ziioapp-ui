## 开发约定

- 使用根 package.json 指定的 Node 与 pnpm。
- 根 dev/build/typecheck/test 遍历所有 workspace，单包使用 pnpm filter。
- 使用全局 Biome，不添加 Prettier、ESLint 或本地 Biome。
- 不修改 upstream 原件或直接手改生成组件；使用有哈希校验的升级流程。
- 用户未要求时不运行 dev/build、不新增测试、不启用子代理。
- 不擅自发布、推拉 Git 或手改锁文件。
- 报告放 _reports，中文文件名 YYMMDD-序号-说明.md。
