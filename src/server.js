import dotenv from 'dotenv';
dotenv.config();
import app from './app.js';
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`SERVIDOR RODANDO NA PORTA: http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map