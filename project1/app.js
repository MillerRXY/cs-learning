const express = require('express');
const app = express();
const port = 3882;

// 提供 public 目录为静态资源目录
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});