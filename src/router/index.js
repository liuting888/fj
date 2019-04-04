import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import fj500 from '@/components/fj500'; //404
import fj404 from '@/components/fj404'; //404
import fj403 from '@/components/fj403'; //403
export default new Router({
    routes: [{ //默认的路由视图
            path: '/',
            name: '',
            redirect: 'noLogin'
        },
        {
            path: '/noLogin',
            name: 'noLogin',
            component: resolve => require(['@/components/fjNoLogin'], resolve)
        },

        { //首页
            path: '/index',
            name: 'index',
            component: resolve => require(['@/components/fjHome'], resolve)
        },
        {
            //工作管理 -> 工作任务
            path: '/work-manage-mission',
            name: 'work-manage-mission',
            component: resolve => require(['@/components/fjWorkManage-mission'], resolve)
        },
        {
            //工作管理 -> 信息采集
            path: '/fjWorkManage-info',
            name: 'fjWorkManage-info',
            component: resolve => require(['@/components/fjWorkManage-info'], resolve)
        },
        {
            //工作管理 -> 工作日志
            path: '/fjWorkManage-workLog',
            name: 'fjWorkManage-workLog',
            component: resolve => require(['@/components/fjWorkManage-workLog'], resolve)
        },
        {
            //考勤管理 -> 考勤历史
            path: '/fjAttend-history',
            name: 'fjAttend-history',
            component: resolve => require(['@/components/fjAttend-history'], resolve)
        },
        {
            //考勤管理 -> 请假休假
            path: '/fjAttend-leave',
            name: 'fjAttend-leave',
            component: resolve => require(['@/components/fjAttend-leave'], resolve)
        },
        {
            //考勤管理 -> 考勤申诉
            path: '/fjAttend-appeal',
            name: 'fjAttend-appeal',
            component: resolve => require(['@/components/fjAttend-appeal'], resolve)
        },
        {
            //新闻中心 -> 信息报送
            path: '/fjNewsCenter-infoSubmit',
            name: 'fjNewsCenter-infoSubmit',
            component: resolve => require(['@/components/fjNewsCenter-infoSubmit'], resolve)
        },
        {
            //新闻中心 -> 文章管理
            path: '/fjNewsCenter-articleManage',
            name: 'fjNewsCenter-articleManage',
            component: resolve => require(['@/components/fjNewsCenter-articleManage'], resolve)
        },
        {
            //考核管理 -> 地区考核
            path: '/local-assessment',
            name: 'local-assessment',
            component: resolve => require(['@/components/fjdiqukaohe'], resolve)
        },
        {
            //考核管理 -> 单位考核
            path: '/unit-assessment',
            name: 'unit-assessment',
            component: resolve => require(['@/components/fjDanweikaohe'], resolve)
        },
        {
            //考核管理 -> 个人考核
            path: '/personal-assessment',
            name: 'personal-assessment',
            component: resolve => require(['@/components/fjGerenkaohe'], resolve)
        },
        {
            //考核管理 -> 个人考核 -> 明细列表
            path: '/personal-assessment-list',
            name: 'personal-assessment-list',
            component: resolve => require(['@/components/fjGerenkaohe-dList'], resolve)
        },
        {
            //考核管理 -> 个人考核 -> 考核规则
            path: '/personal-assessment-rules',
            name: 'personal-assessment-rules',
            component: resolve => require(['@/components/fjGerenkaohe-rules'], resolve)
        },
        {
            //考核管理 -> 个人考核 -> 明细列表 -> 考核明细
            path: '/personal-assessment-detail',
            name: 'personal-assessment-detail',
            component: resolve => require(['@/components/fjGerenkaohe-detail'], resolve)
        },
        {
            //考核管理 -> 单位考核 -> 明细列表 -> 考核明细
            path: '/unit-assessment-detail',
            name: 'unit-assessment-detail',
            component: resolve => require(['@/components/fjDanweikaohe-detail'], resolve)
        },
        {
            //考核管理 -> 地区考核 -> 明细列表 -> 考核明细
            path: '/local-assessment-detail',
            name: 'local-assessment-detail',
            component: resolve => require(['@/components/fjDiqukaohe-detail'], resolve)
        },
        {
            //数据中心
            path: '/data-center',
            name: 'data-center',
            component: resolve => require(['@/components/fjDataCenter'], resolve)
        },
        { //系统配置 -> 组织架构
            path: '/organizational-structure',
            name: 'organizational-structure',
            component: resolve => require(['@/components/fjZuzhijiagou'], resolve)
        },
        { //系统配置 -> 考核配置
            path: '/appraise-item',
            name: 'appraise-item',
            component: resolve => require(['@/components/fjAppraiseItem'], resolve)
        },
        { //系统配置 -> 组织架构 -> 个人信息
            path: '/organizational-structure-pInfo',
            name: 'organizational-structure-pInfo',
            component: resolve => require(['@/components/fjZuzhijigou-pInfo'], resolve)
        },
        { //系统配置 -> 工作日志
            path: '/operation-logs',
            name: 'operation-logs',
            component: resolve => require(['@/components/fjLogs'], resolve)
        },
        { //系统配置 -> 组织架构 -> 个人信息 -> 个人轨迹
            path: '/personnel-locus',
            name: 'personnel-locus',
            component: resolve => require(['@/components/fjPersonnelLocus'], resolve)
        },
        { //403
            path: '/403',
            name: '403',
            component: fj403
        },
        { //404
            path: '/404',
            name: '404',
            component: fj404
        },
        { //500
            path: '/500',
            name: '500',
            component: fj500
        },
        { //教培管理 -> 业务知识库
            path: '/knowleage-center',
            name: 'knowleage-center',
            component: resolve => require(['@/components/fjYeWuZhiShi'], resolve)
        },
        { //教培管理 ->培训上传
            path: '/training',
            name: 'training',
            component: resolve => require(['@/components/fjPeixun'], resolve)
        },
        { //教培管理 ->专题考试
            path: '/special-exam',
            name: 'special-exam',
            component: resolve => require(['@/components/fjSpecialExam/fjSpecialExam'], resolve)
        },
        { //教培管理 ->考试考题
            path: '/special-exam-questions',
            name: 'special-exam-questions',
            component: resolve => require(['@/components/fjSpecialExam/fjSpecialExamQuestions'], resolve)
        },
        { //教培管理 ->试卷管理
            path: '/special-exam-manage',
            name: 'special-exam-manage',
            component: resolve => require(['@/components/fjSpecialExam/fjSpecialExamManage'], resolve)
        }, { //教培管理 ->考试得分
            path: '/special-exam-fraction',
            name: 'special-exam-fraction',
            component: resolve => require(['@/components/fjSpecialExam/fjSpecialExamFraction'], resolve)
        }, { //人事管理 ->招聘管理
            path: '/personnel-recruitment',
            name: 'personnel-recruitment',
            component: resolve => require(['@/components/fjPersonnel/fjRecruitment'], resolve)
        }, { //人事管理 ->合同管理
            path: '/personnel-contract',
            name: 'personnel-contract',
            component: resolve => require(['@/components/fjPersonnel/fjContract'], resolve)
        }, { //人事管理 ->档案管理
            path: '/personnel-archives',
            name: 'personnel-archives',
            component: resolve => require(['@/components/fjPersonnel/fjArchives'], resolve)
        }, { //人事管理 ->工资管理
            path: '/personnel-wage',
            name: 'personnel-wage',
            component: resolve => require(['@/components/fjPersonnel/fjWage'], resolve)
        }, { //人事管理 ->规则设置
            path: '/personnel-eule-setting',
            name: 'personnel-eule-setting',
            component: resolve => require(['@/components/fjPersonnel/fjRule-setting'], resolve)
        }

    ]
})