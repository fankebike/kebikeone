<template>
    <div class="welcome">
        <!-- <i class="el-icon-error icon"></i> -->
        <div class="pcc">
        <p>欢迎您的回归！</p>
         <p>生活有你更精彩！</p>
         </div>
    </div>
</template>
<script>
export default {
}
</script>
<style lang="less" scoped>
.welcome{width: 300px;height: 200px;background-color: darkturquoise;position: absolute;
        top:50%;left: 50%;margin-left: -150px;margin-top: -100px;border-radius: 10px;color: #fff;}
@media screen and(max-width: 565px){
    .welcome{width: 200px;height: 100px;margin-left: -100px;margin-top: -50px;font-size: 13px;}
    .pcc{margin-top: -8px;}
 }
.icon{float: right;color: rgb(84, 166, 194);font-size: 25px;cursor: pointer;}
//  .pcc{text-align: center;font-size: 20px;font-weight: bold;
//    font-style: italic;color: #fff;line-height: 10px;margin-top:60px;}
.pcc{font-size: 20px;font-weight: bold;position: absolute;text-align: center;width: 100%;height: 100%;
    top:40%;line-height: 10px;}
p{position: relative;}
</style>
