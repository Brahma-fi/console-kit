const routes = {
  generateCalldata: "/builder/generate",
  fetchAutomationSubscriptions: "/automations/subscriptions/console",
  fetchAutomationLogs: "/kernel/logs",
  kernelTasks: "/kernel/tasks",
  kernelExecutor: "/kernel/executor",
  automationsExecutor: "/automations/executor",
  executorNonce: "/automations/executor/nonce",
  workflowStatus: "/kernel/tasks/status",

  // swap
  swapRoutes: "/builder/swap/routes",
  // bridge
  fetchBridgingRoutes: "/builder/bridge/routes",
  fetchBridgingStatus: "/builder/bridge/status",

  fetchExistingAccounts: "/user/consoles",

  indexTransaction: "/indexer/process",
};

export default routes;
