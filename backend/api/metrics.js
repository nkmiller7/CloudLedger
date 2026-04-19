import { CloudWatchClient, PutMetricDataCommand } from "@aws-sdk/client-cloudwatch";

const cloudwatch = new CloudWatchClient({ region: "us-east-1" });

// Helper function that actually sends metrics to CloudWatch
const pushMetric = async (metricName, value, unit, dimensions) => {
  try {
    await cloudwatch.send(new PutMetricDataCommand({
      Namespace: "CloudLedger/Backend",
      MetricData: [
        {
          MetricName: metricName,
          Value: value,
          Unit: unit,
          Dimensions: dimensions,
          Timestamp: new Date()
        }
      ]
    }));
  } catch (error) {
    console.error("Failed to push metric to CloudWatch:", error.message);
  }
};

export const metricsMiddleware = (req, res, next) => {
  const startTime = Date.now();

  res.on("finish", async () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;

    const dimensions = [
      { Name: "Endpoint", Value: req.path },
      { Name: "Method", Value: req.method }
    ];

    // Response time
    await pushMetric("ResponseTime", duration, "Milliseconds", dimensions);

    // Request count
    await pushMetric("RequestCount", 1, "Count", dimensions);

    // Error rate
    if (statusCode >= 400) {
      await pushMetric("ErrorCount", 1, "Count", [
        ...dimensions,
        { Name: "StatusCode", Value: String(statusCode) }
      ]);
    }
  });

  next();
};