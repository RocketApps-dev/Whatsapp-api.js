import { Request, Response } from "express";
import pm2Io from "@pm2/io";
import { Controller } from "../Controller";

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    // const runtimePerClass = pm2Io.metric({
    //   id: controller.constructor.name,
    //   name: controller.constructor.name,
    //   unit: "ms",
    // });

    // const currentRequests = pm2Io.counter({
    //   id: "current_requests",
    //   name: "Current Requests API",
    // });

    // const latency = pm2Io.metric({
    //   id: "latency",
    //   name: "Latency API",
    //   unit: "ms",
    // });

    // let latencyStart: number;
    // currentRequests.inc();

    try {
      // latencyStart = Date.now();

      const requestData = {
        ...request.body,
        ...request.params,
        ...request.query,
        ...request.headers,
        ...request.file,
        userId: request.userId,
        userAdmin: request.isAdmin,
        companyToken: request.companyToken,
      };

      const httpResponse = await controller.handle(requestData);

      // latency.set(Date.now() - latencyStart);
      // runtimePerClass.set(Date.now() - latencyStart);
      // currentRequests.dec();

      if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
        return response.status(httpResponse.statusCode).json(httpResponse.body);
      } else {
        return response.status(httpResponse.statusCode).json({
          error: httpResponse.body.error,
        });
      }
    } catch (err) {
      // latency.set(Date.now() - latencyStart);
      // runtimePerClass.set(Date.now() - latencyStart);
      // currentRequests.dec();

      return response.status(500).json({
        message: err.message,
      });
    }
  };
};
