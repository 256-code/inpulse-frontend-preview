export type ProjectStatus = "正常" | "已归档"
export type TaskStatus = "未完成" | "已完成" | "已取消"
export type TaskScope = "功能级" | "模块级"
export type Priority = "高" | "中" | "低"
export type RecordStatus = "草稿" | "已发布" | "已作废"

export interface Feature {
  id: string
  code: string
  name: string
  currentBehavior: string
  projectId: string
  moduleId: string
}

export interface ProjectModule {
  id: string
  code: string
  name: string
  description: string
  icon: string
  features: Feature[]
}

export interface Project {
  id: string
  code: string
  name: string
  type: string
  color: string
  description: string
  status: ProjectStatus
  modules: ProjectModule[]
}

export interface Task {
  id: string
  code: string
  title: string
  description: string
  projectId: string
  moduleId: string
  featureId?: string
  scope: TaskScope
  owner: string
  creator: string
  priority: Priority
  status: TaskStatus
  due: string
  createdAt: string
  completedAt?: string
  completionNote?: string
  impactFeatureIds: string[]
  githubLinks: string[]
  mergeRole?: 'MAIN' | 'SOURCE'
  mainTaskId?: string
  sourceTaskIds?: string[]
  taskGroupId?: string
}

export interface ChangeRecord {
  id: string
  code: string
  title: string
  projectId: string
  moduleId: string
  featureId?: string
  impactFeatureIds: string[]
  taskId?: string
  status: RecordStatus
  contextProblem: string
  changeSolution: string
  resultVerification: string
  leftover: string
  author: string
  handler: string
  version: number
  publishedAt?: string
}

function makeFeature(
  id: string,
  code: string,
  name: string,
  currentBehavior: string,
  projectId: string,
  moduleId: string,
): Feature {
  return { id, code, name, currentBehavior, projectId, moduleId }
}

export const PROJECTS: Project[] = [
  {
    id: "agv",
    code: "AGV-OPS",
    name: "AGV 智能搬运平台",
    type: "AGV",
    color: "cyan",
    description: "面向工厂搬运场景的多车协同与任务调度平台",
    status: "正常",
    modules: [
      {
        id: "mod-agv-task",
        code: "MOD-AGV-01",
        name: "任务调度",
        description: "任务池、优先级、路径规划与多车协同",
        icon: "target",
        features: [
          makeFeature("feature-agv-dispatch", "AGV-F-001", "多车路径规划", "基于地图与站点约束生成多车运行路径，并处理冲突回退。", "agv", "mod-agv-task"),
          makeFeature("feature-agv-task-pool", "AGV-F-002", "任务池与优先级", "统一管理搬运任务池，按项目、设备与优先级分配任务。", "agv", "mod-agv-task"),
          makeFeature("feature-agv-charge", "AGV-F-003", "充电任务编排", "根据电量、任务与站点状态编排充电任务。", "agv", "mod-agv-task"),
        ],
      },
      {
        id: "mod-agv-map",
        code: "MOD-AGV-02",
        name: "地图与站点",
        description: "地图版本、站点拓扑与禁行区配置",
        icon: "map",
        features: [
          makeFeature("feature-agv-map", "AGV-F-101", "地图版本管理", "维护地图版本、发布与回滚记录。", "agv", "mod-agv-map"),
          makeFeature("feature-agv-station", "AGV-F-102", "站点拓扑配置", "维护站点、巷道、禁行区与充电区拓扑。", "agv", "mod-agv-map"),
        ],
      },
      {
        id: "mod-agv-device",
        code: "MOD-AGV-03",
        name: "设备接入",
        description: "AGV 协议适配、心跳、状态与告警",
        icon: "terminal",
        features: [
          makeFeature("feature-agv-protocol", "AGV-F-201", "AGV 协议适配", "适配不同品牌 AGV 的协议并统一设备状态模型。", "agv", "mod-agv-device"),
          makeFeature("feature-agv-heartbeat", "AGV-F-202", "心跳与状态监控", "采集心跳与运动状态，异常时触发告警。", "agv", "mod-agv-device"),
        ],
      },
    ],
  },
  {
    id: "rcs",
    code: "RCS-CORE",
    name: "RCS 机器人调度系统",
    type: "RCS",
    color: "blue",
    description: "统一接入 AMR / AGV，提供交通管制与设备编排能力",
    status: "正常",
    modules: [
      {
        id: "mod-rcs-traffic",
        code: "MOD-RCS-01",
        name: "交通管制",
        description: "区域锁、死锁检测、拥塞与通行策略",
        icon: "bot",
        features: [
          makeFeature("feature-rcs-lock", "RCS-F-001", "区域锁与死锁检测", "对关键区域加锁，检测车辆停滞与互锁风险。", "rcs", "mod-rcs-traffic"),
          makeFeature("feature-rcs-pass", "RCS-F-002", "通行策略", "根据交通管制状态调度车辆通行。", "rcs", "mod-rcs-traffic"),
        ],
      },
      {
        id: "mod-rcs-device",
        code: "MOD-RCS-02",
        name: "设备接入",
        description: "RCS 设备心跳、状态统一与告警",
        icon: "terminal",
        features: [
          makeFeature("feature-rcs-session", "RCS-F-101", "RCS 心跳监控", "持续监控 RCS 设备心跳并判断在线状态。", "rcs", "mod-rcs-device"),
          makeFeature("feature-rcs-alarm", "RCS-F-102", "设备告警", "统一处理离线、异常、通信失败等设备告警。", "rcs", "mod-rcs-device"),
        ],
      },
      {
        id: "mod-rcs-schedule",
        code: "MOD-RCS-03",
        name: "任务调度",
        description: "RCS 任务编排与异常重连",
        icon: "target",
        features: [
          makeFeature("feature-rcs-reconnect", "RCS-F-201", "心跳超时重连机制", "心跳超时后按策略重连并恢复设备状态。", "rcs", "mod-rcs-schedule"),
          makeFeature("feature-rcs-dispatch", "RCS-F-202", "任务编排", "将 RCS 任务拆分、编排并下发到设备。", "rcs", "mod-rcs-schedule"),
        ],
      },
    ],
  },
  {
    id: "wes",
    code: "WES-NOVA",
    name: "WES 仓储执行系统",
    type: "WES",
    color: "amber",
    description: "连接 WMS、设备与现场作业的实时执行中枢",
    status: "正常",
    modules: [
      {
        id: "mod-wes-inventory",
        code: "MOD-WES-01",
        name: "库存执行",
        description: "WMS 任务下发、库存锁定与执行回传",
        icon: "box",
        features: [
          makeFeature("feature-wes-wms", "WES-F-001", "WMS 任务下发", "接收 WMS 任务并下发到仓储执行设备。", "wes", "mod-wes-inventory"),
          makeFeature("feature-wes-stock", "WES-F-002", "库存锁定与回传", "执行库存锁定、扣减与结果回传。", "wes", "mod-wes-inventory"),
          makeFeature("feature-wes-wave", "WES-F-003", "波次拆分策略", "将大批量任务拆分为可执行的波次。", "wes", "mod-wes-inventory"),
        ],
      },
      {
        id: "mod-wes-alert",
        code: "MOD-WES-02",
        name: "异常告警",
        description: "异常分级、通知策略与闭环追踪",
        icon: "alert",
        features: [
          makeFeature("feature-wes-level", "WES-F-101", "异常分级与通知", "按业务影响对异常分级并通知相关人员。", "wes", "mod-wes-alert"),
          makeFeature("feature-wes-track", "WES-F-102", "告警闭环追踪", "记录告警处理进度并追踪到关闭。", "wes", "mod-wes-alert"),
        ],
      },
      {
        id: "mod-wes-station",
        code: "MOD-WES-03",
        name: "站点管理",
        description: "站点、库位与入库校验配置",
        icon: "package",
        features: [
          makeFeature("feature-wes-inbound", "WES-F-201", "站点入库校验", "校验入库站点、库位与业务规则。", "wes", "mod-wes-station"),
          makeFeature("feature-wes-code", "WES-F-202", "站点编码配置", "维护站点编码与业务映射。", "wes", "mod-wes-station"),
        ],
      },
    ],
  },
  {
    id: "material",
    code: "MAT-CLOUD",
    name: "物料管理系统",
    type: "MAT",
    color: "green",
    description: "物料主数据、库存盘点与供应商管理",
    status: "正常",
    modules: [
      {
        id: "mod-mat-main",
        code: "MOD-MAT-01",
        name: "物料档案",
        description: "物料主数据、编码规则与生命周期",
        icon: "package",
        features: [
          makeFeature("feature-mat-data", "MAT-F-001", "物料主数据维护", "维护物料名称、规格、单位与状态。", "material", "mod-mat-main"),
          makeFeature("feature-mat-code", "MAT-F-002", "物料编码规则", "按规则生成并校验物料编码。", "material", "mod-mat-main"),
        ],
      },
      {
        id: "mod-mat-stock",
        code: "MOD-MAT-02",
        name: "库存盘点",
        description: "盘点任务、差异处理与库存校准",
        icon: "clipboard",
        features: [
          makeFeature("feature-mat-count", "MAT-F-101", "盘点任务生成", "根据周期和范围生成盘点任务。", "material", "mod-mat-stock"),
          makeFeature("feature-mat-diff", "MAT-F-102", "盘点差异处理", "记录盘点差异并生成调整结果。", "material", "mod-mat-stock"),
        ],
      },
      {
        id: "mod-mat-supplier",
        code: "MOD-MAT-03",
        name: "供应商",
        description: "供应商准入与采购价格管理",
        icon: "truck",
        features: [
          makeFeature("feature-mat-access", "MAT-F-201", "供应商准入", "维护供应商资质、准入状态与资料。", "material", "mod-mat-supplier"),
          makeFeature("feature-mat-price", "MAT-F-202", "采购价格管理", "维护采购价格、生效时间与变更记录。", "material", "mod-mat-supplier"),
        ],
      },
    ],
  },
  {
    id: "print",
    code: "PRINT-CORE",
    name: "3D 打印管理系统",
    type: "3DP",
    color: "violet",
    description: "打印任务、设备状态与质量追溯管理",
    status: "正常",
    modules: [
      {
        id: "mod-print-job",
        code: "MOD-PRINT-01",
        name: "打印任务",
        description: "模型切片、任务创建与队列调度",
        icon: "printer",
        features: [
          makeFeature("feature-print-slice", "PRINT-F-001", "切片任务管理", "管理模型切片参数、切片进度与结果。", "print", "mod-print-job"),
          makeFeature("feature-print-queue", "PRINT-F-002", "打印队列调度", "按设备、优先级和材料调度打印队列。", "print", "mod-print-job"),
        ],
      },
      {
        id: "mod-print-device",
        code: "MOD-PRINT-02",
        name: "设备管理",
        description: "打印机状态、耗材与维护管理",
        icon: "box",
        features: [
          makeFeature("feature-print-status", "PRINT-F-101", "3D 打印机状态监控", "监控打印机在线、打印与故障状态。", "print", "mod-print-device"),
          makeFeature("feature-print-material", "PRINT-F-102", "耗材管理", "管理耗材余量、更换与预警。", "print", "mod-print-device"),
        ],
      },
      {
        id: "mod-print-quality",
        code: "MOD-PRINT-03",
        name: "质量追溯",
        description: "打印质量检测与批次追溯",
        icon: "alert",
        features: [
          makeFeature("feature-print-inspect", "PRINT-F-201", "打印质量检测", "根据检测标准判断打印件质量。", "print", "mod-print-quality"),
          makeFeature("feature-print-batch", "PRINT-F-202", "批次追溯", "记录批次的材料、设备与打印参数。", "print", "mod-print-quality"),
        ],
      },
    ],
  },
]

export const TASKS: Task[] = [
  {
    id: "task-agv-001",
    code: "AGV-T-001",
    title: "多车路径规划冲突回退策略",
    mergeRole: "MAIN",
    sourceTaskIds: ["task-agv-003"],
    taskGroupId: "TG-001",
    description: "处理多车同时进入同一区域时的路径冲突，增加回退策略和验证指标。",
    projectId: "agv",
    moduleId: "mod-agv-task",
    featureId: "feature-agv-dispatch",
    scope: "功能级",
    owner: "林一",
    creator: "周宁",
    priority: "高",
    status: "未完成",
    due: "今天",
    createdAt: "2025-06-12 09:40",
    impactFeatureIds: [],
    githubLinks: ["https://github.com/agv-rcs-demo/agv-platform/pull/284"],
  },
  {
    id: "task-agv-002",
    code: "AGV-T-002",
    title: "充电任务编排参数化",
    description: "将充电阈值、优先级和排队策略参数化，减少现场配置成本。",
    projectId: "agv",
    moduleId: "mod-agv-task",
    featureId: "feature-agv-charge",
    scope: "功能级",
    owner: "陈澈",
    creator: "林一",
    priority: "中",
    status: "已完成",
    due: "已完成",
    createdAt: "2025-06-05 14:20",
    completedAt: "2025-06-10 17:35",
    impactFeatureIds: [],
    githubLinks: ["https://github.com/agv-rcs-demo/agv-platform/pull/271"],
  },
  {
    id: "task-agv-003",
    code: "AGV-T-003",
    title: "AGV 协议适配联调",
    mergeRole: "SOURCE",
    mainTaskId: "task-agv-001",
    taskGroupId: "TG-001",
    description: "完成新品牌 AGV 的协议联调与现场验证。",
    projectId: "agv",
    moduleId: "mod-agv-device",
    featureId: "feature-agv-protocol",
    scope: "功能级",
    owner: "周宁",
    creator: "陈澈",
    priority: "中",
    status: "未完成",
    due: "下周一",
    createdAt: "2025-06-11 10:00",
    impactFeatureIds: [],
    githubLinks: [],
  },
  {
    id: "task-agv-004",
    code: "AGV-T-004",
    title: "AGV 设备接入稳定性专项",
    description: "统一治理协议适配、心跳与设备告警的稳定性问题。",
    projectId: "agv",
    moduleId: "mod-agv-device",
    scope: "模块级",
    owner: "林一",
    creator: "周宁",
    priority: "高",
    status: "已完成",
    due: "已完成",
    createdAt: "2025-06-01 09:00",
    completedAt: "2025-06-08 16:30",
    impactFeatureIds: ["feature-agv-protocol", "feature-agv-heartbeat"],
    githubLinks: ["https://github.com/agv-rcs-demo/agv-platform/pull/266"],
  },
  {
    id: "task-agv-005",
    code: "AGV-T-005",
    title: "地图版本切换回滚机制",
    description: "补充地图版本切换失败时的回滚与告警。",
    projectId: "agv",
    moduleId: "mod-agv-map",
    featureId: "feature-agv-map",
    scope: "功能级",
    owner: "许然",
    creator: "陈澈",
    priority: "低",
    status: "已取消",
    due: "已取消",
    createdAt: "2025-06-03 11:20",
    completionNote: "暂缓，等待地图版本发布流程定稿",
    impactFeatureIds: [],
    githubLinks: [],
  },
  {
    id: "task-rcs-001",
    code: "RCS-T-001",
    title: "RCS 心跳超时重连机制",
    description: "优化心跳超时后的重连顺序与状态恢复。",
    projectId: "rcs",
    moduleId: "mod-rcs-schedule",
    featureId: "feature-rcs-reconnect",
    scope: "功能级",
    owner: "周宁",
    creator: "林一",
    priority: "高",
    status: "未完成",
    due: "明天",
    createdAt: "2025-06-11 15:30",
    impactFeatureIds: [],
    githubLinks: ["https://github.com/agv-rcs-demo/rcs-platform/issues/279"],
  },
  {
    id: "task-rcs-002",
    code: "RCS-T-002",
    title: "区域锁死锁检测告警优化",
    description: "降低误报并增加区域锁恢复建议。",
    projectId: "rcs",
    moduleId: "mod-rcs-traffic",
    featureId: "feature-rcs-lock",
    scope: "功能级",
    owner: "林一",
    creator: "周宁",
    priority: "中",
    status: "已完成",
    due: "已完成",
    createdAt: "2025-06-02 09:10",
    completedAt: "2025-06-09 18:20",
    impactFeatureIds: [],
    githubLinks: ["https://github.com/agv-rcs-demo/rcs-platform/pull/258"],
  },
  {
    id: "task-rcs-003",
    code: "RCS-T-003",
    title: "交通管制灰度验证",
    description: "对区域锁、通行策略进行灰度环境验证。",
    projectId: "rcs",
    moduleId: "mod-rcs-traffic",
    scope: "模块级",
    owner: "许然",
    creator: "林一",
    priority: "中",
    status: "未完成",
    due: "周五",
    createdAt: "2025-06-10 09:30",
    impactFeatureIds: ["feature-rcs-lock", "feature-rcs-pass"],
    githubLinks: [],
  },
  {
    id: "task-rcs-004",
    code: "RCS-T-004",
    title: "设备告警去重策略",
    description: "减少同源告警重复出现。",
    projectId: "rcs",
    moduleId: "mod-rcs-device",
    featureId: "feature-rcs-alarm",
    scope: "功能级",
    owner: "陈澈",
    creator: "周宁",
    priority: "中",
    status: "已取消",
    due: "已取消",
    createdAt: "2025-06-04 13:50",
    completionNote: "与设备接入稳定性专项合并",
    impactFeatureIds: [],
    githubLinks: [],
  },
  {
    id: "task-rcs-005",
    code: "RCS-T-005",
    title: "任务编排策略调整",
    description: "调整 RCS 任务编排的合并与下发顺序。",
    projectId: "rcs",
    moduleId: "mod-rcs-schedule",
    featureId: "feature-rcs-dispatch",
    scope: "功能级",
    owner: "林一",
    creator: "陈澈",
    priority: "高",
    status: "已完成",
    due: "已完成",
    createdAt: "2025-05-28 09:40",
    completedAt: "2025-06-05 17:00",
    impactFeatureIds: [],
    githubLinks: ["https://github.com/agv-rcs-demo/rcs-platform/pull/251"],
  },
  {
    id: "task-wes-001",
    code: "WES-T-001",
    title: "站点入库校验规则梳理",
    description: "梳理站点、库位与入库业务规则的校验逻辑。",
    projectId: "wes",
    moduleId: "mod-wes-station",
    featureId: "feature-wes-inbound",
    scope: "功能级",
    owner: "许然",
    creator: "林一",
    priority: "中",
    status: "未完成",
    due: "周五",
    createdAt: "2025-06-10 10:10",
    impactFeatureIds: [],
    githubLinks: [],
  },
  {
    id: "task-wes-002",
    code: "WES-T-002",
    title: "波次拆分策略压测与指标采集",
    description: "压测波次拆分策略并采集执行指标。",
    projectId: "wes",
    moduleId: "mod-wes-inventory",
    featureId: "feature-wes-wave",
    scope: "功能级",
    owner: "林一",
    creator: "陈澈",
    priority: "低",
    status: "未完成",
    due: "下周一",
    createdAt: "2025-06-09 11:40",
    impactFeatureIds: [],
    githubLinks: [],
  },
  {
    id: "task-wes-003",
    code: "WES-T-003",
    title: "WMS 任务下发链路打通",
    description: "打通 WMS → WES → 执行设备的下发链路。",
    projectId: "wes",
    moduleId: "mod-wes-inventory",
    featureId: "feature-wes-wms",
    scope: "功能级",
    owner: "陈澈",
    creator: "林一",
    priority: "高",
    status: "已完成",
    due: "已完成",
    createdAt: "2025-05-30 09:00",
    completedAt: "2025-06-06 16:40",
    impactFeatureIds: [],
    githubLinks: ["https://github.com/agv-rcs-demo/wes-platform/pull/230"],
  },
  {
    id: "task-wes-004",
    code: "WES-T-004",
    title: "异常告警闭环追踪",
    description: "完善异常告警从发生到关闭的追踪流程。",
    projectId: "wes",
    moduleId: "mod-wes-alert",
    scope: "模块级",
    owner: "许然",
    creator: "周宁",
    priority: "中",
    status: "未完成",
    due: "下周三",
    createdAt: "2025-06-11 09:20",
    impactFeatureIds: ["feature-wes-level", "feature-wes-track"],
    githubLinks: [],
  },
  {
    id: "task-wes-005",
    code: "WES-T-005",
    title: "库存锁定回传异常处理",
    description: "增加库存锁定回传异常时的重试与补偿。",
    projectId: "wes",
    moduleId: "mod-wes-inventory",
    featureId: "feature-wes-stock",
    scope: "功能级",
    owner: "周宁",
    creator: "许然",
    priority: "中",
    status: "已取消",
    due: "已取消",
    createdAt: "2025-06-05 14:00",
    completionNote: "等待库存执行方案调整",
    impactFeatureIds: [],
    githubLinks: [],
  },
  {
    id: "task-mat-001",
    code: "MAT-T-001",
    title: "物料主数据清洗规则",
    description: "清理重复物料并建立主数据校验规则。",
    projectId: "material",
    moduleId: "mod-mat-main",
    featureId: "feature-mat-data",
    scope: "功能级",
    owner: "林一",
    creator: "周宁",
    priority: "高",
    status: "未完成",
    due: "周五",
    createdAt: "2025-06-10 09:20",
    impactFeatureIds: [],
    githubLinks: [],
  },
  {
    id: "task-mat-002",
    code: "MAT-T-002",
    title: "盘点任务自动生成",
    description: "按物料范围和周期自动生成盘点任务。",
    projectId: "material",
    moduleId: "mod-mat-stock",
    scope: "模块级",
    owner: "许然",
    creator: "林一",
    priority: "中",
    status: "未完成",
    due: "下周四",
    createdAt: "2025-06-09 15:30",
    impactFeatureIds: ["feature-mat-count", "feature-mat-diff"],
    githubLinks: [],
  },
  {
    id: "task-mat-003",
    code: "MAT-T-003",
    title: "物料编码规则校验",
    description: "增加物料编码规则校验与重复提示。",
    projectId: "material",
    moduleId: "mod-mat-main",
    featureId: "feature-mat-code",
    scope: "功能级",
    owner: "陈澈",
    creator: "周宁",
    priority: "中",
    status: "已完成",
    due: "已完成",
    createdAt: "2025-05-29 10:20",
    completedAt: "2025-06-04 17:10",
    impactFeatureIds: [],
    githubLinks: ["https://github.com/agv-rcs-demo/material-platform/pull/118"],
  },
  {
    id: "task-mat-004",
    code: "MAT-T-004",
    title: "供应商准入资料校验",
    description: "补充供应商准入资料完整性和有效期校验。",
    projectId: "material",
    moduleId: "mod-mat-supplier",
    featureId: "feature-mat-access",
    scope: "功能级",
    owner: "周宁",
    creator: "陈澈",
    priority: "中",
    status: "未完成",
    due: "下周二",
    createdAt: "2025-06-11 10:40",
    impactFeatureIds: [],
    githubLinks: [],
  },
  {
    id: "task-mat-005",
    code: "MAT-T-005",
    title: "盘点差异处理流程补录",
    description: "补录盘点差异处理流程与操作记录。",
    projectId: "material",
    moduleId: "mod-mat-stock",
    featureId: "feature-mat-diff",
    scope: "功能级",
    owner: "林一",
    creator: "许然",
    priority: "低",
    status: "已取消",
    due: "已取消",
    createdAt: "2025-06-02 13:10",
    completionNote: "待盘点模板确认后重新创建",
    impactFeatureIds: [],
    githubLinks: [],
  },
  {
    id: "task-print-001",
    code: "PRINT-T-001",
    title: "切片任务并发限制",
    description: "限制切片任务并发数并优化等待队列。",
    projectId: "print",
    moduleId: "mod-print-job",
    featureId: "feature-print-slice",
    scope: "功能级",
    owner: "陈澈",
    creator: "林一",
    priority: "高",
    status: "未完成",
    due: "今天",
    createdAt: "2025-06-12 08:40",
    impactFeatureIds: [],
    githubLinks: [],
  },
  {
    id: "task-print-002",
    code: "PRINT-T-002",
    title: "打印机状态监控轮询优化",
    description: "降低打印机状态轮询频率并保证故障发现时间。",
    projectId: "print",
    moduleId: "mod-print-device",
    featureId: "feature-print-status",
    scope: "功能级",
    owner: "许然",
    creator: "周宁",
    priority: "中",
    status: "已完成",
    due: "已完成",
    createdAt: "2025-05-31 11:20",
    completedAt: "2025-06-07 15:35",
    impactFeatureIds: [],
    githubLinks: ["https://github.com/agv-rcs-demo/print-platform/pull/96"],
  },
  {
    id: "task-print-003",
    code: "PRINT-T-003",
    title: "打印队列调度策略",
    description: "根据设备、优先级与材料管理打印队列。",
    projectId: "print",
    moduleId: "mod-print-job",
    scope: "模块级",
    owner: "周宁",
    creator: "林一",
    priority: "中",
    status: "未完成",
    due: "下周一",
    createdAt: "2025-06-10 16:00",
    impactFeatureIds: ["feature-print-slice", "feature-print-queue"],
    githubLinks: [],
  },
  {
    id: "task-print-004",
    code: "PRINT-T-004",
    title: "耗材余量预警",
    description: "在耗材余量低于阈值时提醒更换。",
    projectId: "print",
    moduleId: "mod-print-device",
    featureId: "feature-print-material",
    scope: "功能级",
    owner: "林一",
    creator: "陈澈",
    priority: "中",
    status: "未完成",
    due: "下周三",
    createdAt: "2025-06-11 13:20",
    impactFeatureIds: [],
    githubLinks: [],
  },
  {
    id: "task-print-005",
    code: "PRINT-T-005",
    title: "打印质量检测阈值调整",
    description: "根据现场样本调整质量检测阈值。",
    projectId: "print",
    moduleId: "mod-print-quality",
    featureId: "feature-print-inspect",
    scope: "功能级",
    owner: "许然",
    creator: "周宁",
    priority: "低",
    status: "已完成",
    due: "已完成",
    createdAt: "2025-06-03 17:00",
    completedAt: "2025-06-09 10:55",
    impactFeatureIds: [],
    githubLinks: [],
  },
]

export const RECORDS: ChangeRecord[] = [
  {
    id: "record-agv-charge",
    code: "AGV-CR-001",
    title: "充电任务编排参数化",
    projectId: "agv",
    moduleId: "mod-agv-task",
    featureId: "feature-agv-charge",
    impactFeatureIds: [],
    taskId: "task-agv-002",
    status: "已发布",
    contextProblem: "充电阈值和排队策略写死在代码中，现场配置成本高。",
    changeSolution: "将阈值、优先级与排队策略改为可配置参数。",
    resultVerification: "现场验证 5 台 AGV 充电优先级均按配置执行。",
    leftover: "充电失败后的告警策略仍需补充。",
    author: "陈澈",
    handler: "陈澈",
    version: 1,
    publishedAt: "2025-06-10 17:35",
  },
  {
    id: "record-agv-device",
    code: "AGV-CR-002",
    title: "AGV 设备接入稳定性专项",
    projectId: "agv",
    moduleId: "mod-agv-device",
    impactFeatureIds: ["feature-agv-protocol", "feature-agv-heartbeat"],
    taskId: "task-agv-004",
    status: "已发布",
    contextProblem: "不同品牌 AGV 协议不一致，设备离线后状态恢复存在偏差。",
    changeSolution: "统一协议适配层，增加心跳与状态恢复策略。",
    resultVerification: "稳定性专项回归通过，设备恢复时间降低至 10 秒内。",
    leftover: "特殊型号设备的告警字段仍需人工确认。",
    author: "林一",
    handler: "周宁",
    version: 1,
    publishedAt: "2025-06-08 16:30",
  },
  {
    id: "record-rcs-lock",
    code: "RCS-CR-001",
    title: "区域锁死锁检测告警优化",
    projectId: "rcs",
    moduleId: "mod-rcs-traffic",
    featureId: "feature-rcs-lock",
    impactFeatureIds: [],
    taskId: "task-rcs-002",
    status: "已发布",
    contextProblem: "区域锁告警误报较多，缺少恢复建议。",
    changeSolution: "增加稳定时间窗口与死锁恢复建议。",
    resultVerification: "模拟 100 次异常场景，误报率下降至 2%。",
    leftover: "",
    author: "林一",
    handler: "林一",
    version: 1,
    publishedAt: "2025-06-09 18:20",
  },
  {
    id: "record-rcs-dispatch",
    code: "RCS-CR-002",
    title: "任务编排策略调整",
    projectId: "rcs",
    moduleId: "mod-rcs-schedule",
    featureId: "feature-rcs-dispatch",
    impactFeatureIds: [],
    taskId: "task-rcs-005",
    status: "已发布",
    contextProblem: "任务编排顺序导致部分任务排队过长。",
    changeSolution: "调整任务合并与下发顺序。",
    resultVerification: "平均排队时长下降 23%。",
    leftover: "高峰期任务量超过 200 条时仍需跟踪。",
    author: "林一",
    handler: "林一",
    version: 1,
    publishedAt: "2025-06-05 17:00",
  },
  {
    id: "record-wes-wms",
    code: "WES-CR-001",
    title: "WMS 任务下发链路打通",
    projectId: "wes",
    moduleId: "mod-wes-inventory",
    featureId: "feature-wes-wms",
    impactFeatureIds: [],
    taskId: "task-wes-003",
    status: "已发布",
    contextProblem: "WMS 到 WES 的任务下发链路未完全打通。",
    changeSolution: "完成接口接入、重试与结果回传。",
    resultVerification: "端到端链路 50 次压测全部成功。",
    leftover: "异常任务的手工补偿入口尚未完善。",
    author: "陈澈",
    handler: "陈澈",
    version: 1,
    publishedAt: "2025-06-06 16:40",
  },
  {
    id: "record-mat-code",
    code: "MAT-CR-001",
    title: "物料编码规则校验",
    projectId: "material",
    moduleId: "mod-mat-main",
    featureId: "feature-mat-code",
    impactFeatureIds: [],
    taskId: "task-mat-003",
    status: "已发布",
    contextProblem: "物料编码重复时提示不清晰，影响录入效率。",
    changeSolution: "增加规则校验、重复提示与统一格式。",
    resultVerification: "新增物料重复录入率下降 80%。",
    leftover: "历史脏编码仍需一次专项清理。",
    author: "陈澈",
    handler: "陈澈",
    version: 1,
    publishedAt: "2025-06-04 17:10",
  },
  {
    id: "record-print-status",
    code: "PRINT-CR-001",
    title: "打印机状态监控轮询优化",
    projectId: "print",
    moduleId: "mod-print-device",
    featureId: "feature-print-status",
    impactFeatureIds: [],
    taskId: "task-print-002",
    status: "已发布",
    contextProblem: "打印机状态轮询频率过高，占用设备资源。",
    changeSolution: "根据设备状态动态调整轮询间隔。",
    resultVerification: "设备资源占用下降 35%，故障发现时间保持可接受。",
    leftover: "",
    author: "许然",
    handler: "许然",
    version: 1,
    publishedAt: "2025-06-07 15:35",
  },
  {
    id: "record-mat-draft",
    code: "MAT-CR-DRAFT",
    title: "物料主数据清洗规则",
    projectId: "material",
    moduleId: "mod-mat-main",
    featureId: "feature-mat-data",
    impactFeatureIds: [],
    status: "草稿",
    contextProblem: "当前存在重复物料与编码不一致问题。",
    changeSolution: "计划建立主数据清洗规则。",
    resultVerification: "",
    leftover: "需要确认跨系统主数据来源。",
    author: "林一",
    handler: "林一",
    version: 1,
  },
]

export const ACTIVITY: Array<[string, string, string, string]> = [
  ["林一", "发布了迭代记录", "AGV 设备接入稳定性专项", "8 分钟前"],
  ["周宁", "创建了任务", "RCS 心跳超时重连机制", "26 分钟前"],
  ["许然", "创建了任务", "站点入库校验规则梳理", "1 小时前"],
  ["陈澈", "完成了任务", "充电任务编排参数化", "2 小时前"],
]

export function findProject(projectId: string): Project | undefined {
  return PROJECTS.find((project) => project.id === projectId)
}

export function findModule(projectId: string, moduleId: string): ProjectModule | undefined {
  return findProject(projectId)?.modules.find((item) => item.id === moduleId)
}

export function findFeature(projectId: string, featureId: string): Feature | undefined {
  for (const moduleItem of findProject(projectId)?.modules ?? []) {
    const featureItem = moduleItem.features.find((item) => item.id === featureId)
    if (featureItem) return featureItem
  }
  return undefined
}

export function tasksForProject(tasks: Task[], projectId: string): Task[] {
  return tasks.filter((task) => task.projectId === projectId)
}

export function tasksForModule(tasks: Task[], projectId: string, moduleId: string): Task[] {
  return tasks.filter((task) => task.projectId === projectId && task.moduleId === moduleId)
}

export function tasksForFeature(tasks: Task[], featureId: string): Task[] {
  return tasks.filter((task) => task.featureId === featureId || task.impactFeatureIds.includes(featureId))
}

export function recordsForTask(records: ChangeRecord[], taskId: string): ChangeRecord[] {
  return records.filter((record) => record.taskId === taskId)
}

export function recordsForFeature(records: ChangeRecord[], featureId: string): ChangeRecord[] {
  return records.filter((record) => record.featureId === featureId || record.impactFeatureIds.includes(featureId))
}

export function recordsForModule(records: ChangeRecord[], projectId: string, moduleId: string): ChangeRecord[] {
  return records.filter((record) => record.projectId === projectId && record.moduleId === moduleId)
}
