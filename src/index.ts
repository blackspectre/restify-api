import "reflect-metadata";
import { ApiServer } from "./server/index";
import { createTypeormConnection } from "./database/createTypeormConnection";

export const startServer = async (): Promise<any> => {
  const server = new ApiServer();
  await createTypeormConnection();

  const app = await server.start(8080);

  return app;
};

startServer();
