# FIT5032 Library · Weeks 1–8

在原 Week 4 项目的基础上，保留 Week 1 姓名组件、Week 2 JSON 练习，补齐 Week 5–8。原来的三个项目文件夹未修改。Week 9 已完成 Book Counter 前端及 countBooks 后台代码，停在第三处代码截图；函数尚未启动或部署。

## 本地启动

需要 Node.js 22 或以上和 Java 21 或以上。首次运行模拟器会下载 Firebase 官方组件。

```sh
npm install
```

终端 A 保持运行：

```sh
npm run emulators
```

终端 B：

```sh
npm run seed
npm run dev -- --host 127.0.0.1
```

- 应用：[http://127.0.0.1:5173](http://127.0.0.1:5173)
- Firebase Emulator UI：[http://127.0.0.1:4000](http://127.0.0.1:4000)
- 默认项目 `demo-fit5032`，Auth 9099，Firestore 8080，均只监听本机。
- `npm run emulators` 正常结束时将数据导出到被 Git 忽略的 `.emulator-data`，下次启动自动导入。强制结束进程可能来不及导出。
- `seed` 只补充缺失的示例书和本地测试账号。首次 SDK 初始化可能出现 MetadataLookupWarning；模拟器连接成功后的 ready 消息表示初始化完成。

## 练习账号

以下全部是本地演示账号，不用于云端：

| 练习 | 用户名 / 邮箱 | 密码 | 权限 |
| --- | --- | --- | --- |
| Week 5 路由 | `student` | `Library123!` | 查看 About；不能代替 Firebase 登录 |
| Week 7–8 | `member@library.test` | `Library123!` | 查看、添加图书 |
| Week 7–8 | `admin@library.test` | `Library123!` | 查看、添加、修改、删除图书 |

注册的新用户是普通会员。管理员权限通过本地 Admin SDK 设置 custom claims，前端不能自行授予权限。Firestore 规则也会检查权限，不仅隐藏按钮。

## 已实现

| 周 | 功能 | 主要文件 |
| --- | --- | --- |
| 1 | MyName 姓名组件 | `src/components/MyName.vue` |
| 2 | JSON、computed 筛选/映射、v-for、条件显示、高亮 | `src/components/JSONLab.vue` |
| 3–4 | Bootstrap 响应式表单、校验、卡片、PrimeVue DataTable | `src/components/LibraryRegistrationForm.vue` |
| 5 | 确认密码失焦及提交校验、friend 提示、suburb 双向绑定、受保护路由、演示登录/退出 | `src/router/index.js`、`src/views` |
| 6 | Firebase Auth / Firestore 本地模拟器 | `firebase.json`、`scripts/start-emulators.mjs` |
| 7 | 邮箱注册/登录、恢复当前用户、退出、管理员/会员角色 | `src/stores/auth.js`、`src/components/FirebaseAuthForm.vue` |
| 8 | books 增删改查、ISBN 数值校验、where / orderBy / limit、数据库权限 | `src/services/books.js`、`src/components/BookList.vue`、`firestore.rules` |

注册表单展示记录只保存在当前页面内存中，密码显示为掩码；Firebase 注册和图书数据保存在模拟器中。默认图书查询为 `isbn > 1000`，按 ISBN 升序，最多 10 条，可在页面调整查询。

## 验证

```sh
npm test
npm run build
```

模拟器已运行时：

```sh
npm run test:integration
```

模拟器尚未运行时，可自动启动临时实例：

```sh
npm run test:emulators
```

集成测试固定使用独立项目 `demo-fit5032-test`，只清空该测试数据库，不影响应用项目中的练习数据。模拟器启动状态下不要再运行第二个占用相同端口的模拟器实例。

验收截图见 `docs/evidence`；课程提交证据清单见 `docs/coursework-checklist.md`。构建有 Firebase / PrimeVue 依赖体积提示；npm audit 仍报告上游依赖告警，未用破坏性降级强行消除。

## 云端与后续

当前无需 Firebase 登录、付费方案或部署。云端配置模板在 `.env.example`；真实项目配置、云端规则部署和 Week 9 函数运行验收需在后续单独完成。请勿将本地演示账号当成云端凭据。

本地连接方式参考 [Firebase Auth 模拟器文档](https://firebase.google.com/docs/emulator-suite/connect_auth) 和 [Firestore 模拟器文档](https://firebase.google.com/docs/emulator-suite/connect_firestore)。
