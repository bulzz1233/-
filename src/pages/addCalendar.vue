<template>
    <div class="box_layout">
        <div class="background"></div>
        <div class="box">
            <router-link
                replace
                href="#"
                class="el-icon-close icon close"
                :to="`${thePath}`"
            ></router-link>
            <div class="title">添加训练到日历</div>
            <div class="form_layout">
                <el-form
                    :model="ruleForm"
                    :rules="rules"
                    ref="ruleForm"
                    label-width="100px"
                    class="demo-ruleForm"
                >
                    <el-form-item label="运动名称" prop="name">
                        <el-col :span="24">
                            <el-input v-model="ruleForm.name" :disabled="true"></el-input>
                        </el-col>
                    </el-form-item>

                    <el-form-item label="持续时间" required>
                        <el-col :span="11">
                            <el-form-item prop="date">
                                <el-date-picker
                                    v-model="ruleForm.date"
                                    type="daterange"
                                    align="right"
                                    unlink-panels
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :picker-options="pickerOptions"
                                ></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="运动间隔" prop="interval">
                        <!-- <el-col :span="24"> -->
                        <el-select v-model="ruleForm.interval" placeholder="请选择运动间隔时间">
                            <el-option label="0天" value="0"></el-option>
                            <el-option label="1天" value="1"></el-option>
                            <el-option label="2天" value="2"></el-option>
                            <el-option label="3天" value="3"></el-option>
                        </el-select>
                        <!-- </el-col> -->
                    </el-form-item>
                    <el-form-item label="开启提醒" prop="reminder">
                        <el-switch
                            v-model="ruleForm.reminder"
                            inactive-color="rgb(218, 217, 217)"
                        ></el-switch>
                    </el-form-item>

                    <el-form-item>
                        <el-button class="add_btn" type="primary" @click="submitForm('ruleForm')">
                            立即添加
                        </el-button>
                        <el-button @click="resetForm('ruleForm')">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            params: JSON.parse(this.$route.query.detail),
            ruleForm: {
                name: JSON.parse(this.$route.query.detail).sportName,
                type: JSON.parse(this.$route.query.detail).sportType,

                date: '',
                interval: '',
                reminder: false,
                uid: '',
            },

            rules: {
                date: [{ required: true, message: '请选择日期', trigger: 'change' }],
                interval: [{ required: true, message: '请选择运动间隔', trigger: 'change' }],
            },
            pickerOptions: {
                shortcuts: [
                    {
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                    {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        },
                    },
                ],
                disabledDate: time => {
                    let Tdate = new Date();
                    return time.getTime() < Tdate.getTime() - 8.64e7;
                },
            },
        };
    },
    computed: {
        thePath() {
            if (this.$route.path.indexOf('searchResult') != -1) {
                return '/mainpage/searchResult/';
            }
            if (this.$route.path.indexOf('Likes') != -1) {
                return '/mainpage/Likes/';
            } else {
                return '/mainpage/';
            }
        },
    },

    methods: {
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    //获取范围内日期
                    // console.log(this.ruleForm);
                    var startTime = this.ruleForm.date[0];
                    var endTime = this.ruleForm.date[1];
                    //计算出中间的日期
                    var Chang = [];
                    while (endTime - startTime >= 0) {
                        var year = startTime.getFullYear();
                        var month = startTime.getMonth() + 1;
                        var day = startTime.getDate();
                        // alert(year + '-' + month + '-' + day);
                        var obj = {
                            userId: this.uid,
                            sportName: this.ruleForm.name,
                            sportType: this.ruleForm.type,
                            planDate: year + '/' + month + '/' + day,
                            planInterval: this.ruleForm.interval,
                            planContent: this.ruleForm.name,
                            planReminder: this.ruleForm.reminder,
                            planDone: false,
                        };
                        Chang.push(obj);
                        this.$store.commit('calendarData/addTodoList', obj);

                        startTime.setDate(
                            startTime.getDate() + parseInt(this.ruleForm.interval) + 1
                        );
                        // console.log(year + '/' + month + '/' + day);
                    }
                    let listobj = { list: Chang };
                    //console.log(listobj)
                    //console.log(JSON.stringify(listobj))
                    this.$store.dispatch('calendarData/ToAddPlan', JSON.stringify(listobj));

                    this.$router.replace({
                        path:this.thePath,
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
    },
    mounted() {
        if (localStorage.getItem('user_data')) {
            this.uid = JSON.parse(localStorage.getItem('user_data')).uid;
        }
    },
};
</script>

<style scoped>
.box {
    position: relative;
    min-width: 40rem;
    min-height: 25rem;
    background: white;
    flex-direction: column;

    display: flex;
    z-index: 5;
}
.box_layout {
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 6;
}
.title {
    height: 3.75rem;
    width: 100%;
    background: white;
    font-size: 18px;
    font-weight: bolder;
    display: flex;
    line-height: 1.25;
    justify-content: center;
    align-items: center;
    letter-spacing: 2px;
}
.close {
    float: right;
    position: absolute;
    font-size: 1.875rem;
    top: 0.9375rem;
    left: 36.5rem;
    text-decoration: none;
    color: #0f0f0f;
    z-index: 9;
}
.background {
    background: #0f0f0f;
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0.4;
    z-index: 2;
}
.form_layout {
    position: relative;
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}
.add_btn {
    margin-right: 4.375rem;
}
</style>
