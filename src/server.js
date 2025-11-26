const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 3050;

app.listen(PORT, () => {
  console.log(`Server rodando na porta ${PORT}`);
});
