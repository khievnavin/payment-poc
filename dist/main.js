"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = app.get(config_1.ConfigService);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.useStaticAssets((0, path_1.join)(__dirname, '..', 'public'), { prefix: '/ui' });
    app.connectMicroservice({
        transport: microservices_1.Transport.REDIS,
        options: {
            host: config.get('REDIS_HOST', 'localhost'),
            port: config.get('REDIS_PORT', 6379),
        },
    });
    await app.startAllMicroservices();
    const httpPort = config.get('PORT', 3000);
    await app.listen(httpPort);
    console.log(`Payment service HTTP listening on port ${httpPort}`);
    console.log(`Payment service microservice (Redis) connected at ${config.get('REDIS_HOST', 'localhost')}:${config.get('REDIS_PORT', 6379)}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map