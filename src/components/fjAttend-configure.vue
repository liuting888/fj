<template>
  <!-- 考勤配置 -->
  <div class="fj-content_view attend-configure">
    <div class="fj-block title">
      <fj-breadNav :bread-data="breadData"></fj-breadNav>
    </div>
    <div class="fj-block content">
      <div class="fj-block-head kaohe">
        <p class="title fj-fl">配置列表</p>
      </div>
      <div class="fj-block-body">
        <!-- 筛选 -->
        <ul class="filterOpe-area">
          <li class="area-line fj-clear">
            <div class="item fj-fl">
              <span class="title fj-fl">区县分局：</span>
              <el-select
                class="fj-fl"
                v-model="attendFenjvId"
                @change="getPCSdataById"
                clearable
                :disabled="userControl.isFenjv"
                placeholder="请选择区县分局"
              >
                <el-option
                  v-for="item in FLdeptsData"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </div>
            <div class="item fj-fl">
              <span class="title fj-fl">派出所：</span>
              <el-select
                class="fj-fl"
                v-model="attendPcsId"
                @change="getAttendPersonsDataByPcsId"
                clearable
                :disabled="userControl.isPcs"
                placeholder="请选择派出所"
              >
                <el-option
                  v-for="item in SLdeptsData"
                  :key="item.deptId"
                  :label="item.deptName"
                  :value="item.deptId"
                ></el-option>
              </el-select>
            </div>
            <div class="item fj-fl">
              <el-button type="primary" @click="opePosConOfPersonMultiple">批量配置</el-button>
            </div>
          </li>
        </ul>
        <!-- 表格 -->
        <el-table
          :data="acData"
          ref="multipleTable"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="60"></el-table-column>
          <el-table-column
            label="姓名"
            prop="username"
          ></el-table-column>
          <el-table-column
            label="警号"
            class-name="align-left"
            prop="useraccount"
            :width="columnsWidth.useraccount"
          ></el-table-column>
          <el-table-column
            label="考勤位置"
            class-name="align-left"
            :width="columnsWidth.address"
          >
            <template slot-scope="slot">
              <a href="javascript:;" class="ope-txt">{{slot.row.address}}</a>
            </template>
          </el-table-column>
          <el-table-column
            label="有效范围"
            prop="signScope2"
          ></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="slot">
              <!-- <a
                href="javascript:;"
                class="ope-txt"
              >详情</a> -->
              <a
                href="javascript:;"
                class="ope-txt"
                @click="opePosConOfPersonSingle(slot.row)"
              >配置</a>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="mj-page_wrap">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="[10,20,30]"
            :page-size="pageSize"
            layout="total,prev,pager,next,jumper"
            :total="total"
            @current-change="currentPageChange"
            @prev-click="prevPageChange"
            @next-click="nextPageChange"
            @size-change="sizePageChange"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 考勤位置配置弹层 -->
    <el-dialog
      id="attendConPop"
      title="位置配置"
      :visible.sync="attendConPop"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      width="990px"
      top="6vh"
      @close="closeAttendConPop">
      <div class="fj-block-body body">
        <el-table :data="tmpConPersons" border>
          <el-table-column class-name="align-left" label="姓名" prop="username" width="140"></el-table-column>
          <el-table-column class-name="align-left" label="警号" prop="useraccount" width="140"></el-table-column>
          <el-table-column class-name="align-left" label="考勤位置" prop="address">
            <template slot-scope="slot">
              <a href="javascript:;" class="ope-txt" @click="opePosConOfChoosen(slot.row)">{{slot.row.address}}</a>
            </template>
          </el-table-column>
          <el-table-column class-name="align-left" label="有效范围" prop="signScope2" width="180"></el-table-column>
        </el-table>
      </div>
      <div class="fj-block-body footer" slot="footer">
        <el-button type="primary" @click="confirmUsersAttendConM">确定</el-button>
        <el-button type="default" @click="closeAttendConPop">取消</el-button>
      </div>
    </el-dialog>
    <!-- 考勤位置选点-地图 -->
    <div
      id="attendConMapPop" v-show="attendConMapPop">
      <div class="inner" id="posMap"></div>
      <div class="operate-line">
        <el-select
          class="mr20"
          clearable
          v-model="effectRange"
          @change="changeEffectRange"
          placeholder="请先选择有效范围(半径)"
        >
          <i class="el-icon-location" slot="prefix"></i>
          <el-option
            v-for="item in effectRanges"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          id="acAutoComplete"
          class="searchAddress mr60"
          clearable
          prefix-icon="el-icon-search"
          :value="posAddress"
          placeholder="可输入关键字搜索位置或通过地图选点"
        />
        <el-button type="primary" @click="confirmUserAttendCon">确定</el-button>
        <el-button type="default" @click="attendConMapPop = false">返回</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import fjBreadNav from "@/components/fjBreadNav";
export default {
  name: "fjAttend-configure",
  data() {
    return {
      userInfo: null, //用户信息
      breadData: [
        { name: "当前位置:", path: "" },
        { name: "考勤管理", path: "" },
        { name: "考勤配置", path: "" }
      ],
      currentPage: 1, //页码
      pageSize: 10, //每页条数
      total: 0, //分页总数
      attendFenjvId: "", //分局部门id
      FLdeptsData: [], //分局数据
      attendPcsId: "", //派出所部门id
      SLdeptsData: [], //派出所数据
      acDataArgs: {
        //请求列表数据要发送的参数
      },
      acData: [], //表格数据
      columnsWidth: {
        //列宽度调整
        useraccount: "", //警号
        address: "" //地址
      },
      operateArgs: {
        //页面操作要用到的参数
        nowUser:$.cookie(fjPublic.loginCookieKey),
        deptId: "", //部门id
        minSignScope:1000,  //考勤范围-最小1公里
      },
      //-------------
      attendConPop:false, //考勤配置弹层
      isMultiple:false, //是否是批量编辑
      conPersons:[],  //配置位置的人员->批量
      tmpConPersons:[], //批量修改和传给后台
      isMultipleOpe:false, //是否已经批量修改
      //------------------
      attendConMapPop:false, //地图弹层
      posAddress:"", //搜索的地址
      acMap:null,  //考勤位置地图
      acMapDom:null, //地图弹层dom
      acAutoComplete:null, //搜索自动完成
      geocoder:null,  //经纬度地址解码
      mouseTool:null, //
      circleEditor:null, //圆形编辑工具->设置考勤范围用
      marker:null,    //位置标记
      circle:null,    //圆形标记
      infoWin:null,   //信息标记
      text:null,      //显示有效范围
      toggleInfoWin:true, //切换显示infoWin
      effectRanges:[  //有效范围
        {label:"500米",id:500},
        {label:"1公里",id:1000},
        {label:"2公里",id:2000},
        {label:"3公里",id:3000},
        {label:"5公里",id:5000},
      ],
      effectRange:"",
      tmpConInfo:{ //设置考勤配置信息->单个配置
        "address": "", //考勤地址
        "latlng": "",  //考勤经纬度
        "signScope": "", //考勤范围
        "deptId":"",
        "userId": "", 
        "useraccount": "",
        "username": ""
      },
      tmpMultipleInfo:null, //批量配置用
      userControl:{ //根据登录用户设置页面数据
        isFenjv:false, //禁用部门下拉框->区县分局
        isPcs:false,    //禁用部门下拉框->派出所
        [fjPublic.userRoles.fj]:$.noop,
        [fjPublic.userRoles.pcs](){ //派出所
          //找出对应的分局
          var tmpObj = _.find(this.FLdeptsData,(item)=>{
            return item.deptId.substr(0,6)==this.userInfo.deptId.substr(0,6);
          },this);
          if(tmpObj){
            this.attendFenjvId = tmpObj.deptId;
            this.userControl["isFenjv"] = true;
            //获取派出所数据
            this.getPCSdataById(this.attendFenjvId,true).then(()=>{
              this.attendPcsId = this.userInfo.deptId;
              this.userControl["isPcs"] = true;
              //获取派出所人员数据
              this.getAttendPersonsData(this.attendPcsId).always(()=>{
                fjPublic.closeLoad();
              });
            },()=>{
              fjPublic.closeLoad();
              this.$alert("获取部门人员信息失败","提示",{type:"warning"});
            });
          }else{
            this.$alert("获取部门人员信息失败","提示",{type:"warning"});
          }
        },
        [fjPublic.userRoles.qj](){  //区县分局
          this.attendFenjvId = this.userInfo.deptId;
          this.userControl["isFenjv"] = true;
          //获取派出所数据
          this.getPCSdataById(this.attendFenjvId).then(()=>{
            fjPublic.closeLoad();
          },()=>{
            fjPublic.closeLoad();
            this.$alert("获取部门人员信息失败","提示",{type:"warning"});
          });
        },
        [fjPublic.userRoles.sj](){ //市局
          this.getAttendPersonsData().always(()=>{
                fjPublic.closeLoad();
              });;
        },
        [fjPublic.userRoles.cg](){ //超管
          this.userControl[fjPublic.userRoles.sj].call(this);
        }
      }
    };
  },
  created() {
    this.userInfo = $.parseJSON(fjPublic.getLocalData("userInfo")) || {};
  },
  mounted() {
    //地图弹层的dom
    this.acMapDom = $("#attendConMapPop",this.$el);
    //设置列宽->地址
    this.setColumnWidth();
    //获取数据
    this.requestDatas().then(
      () => {
        //console.log(this.FLdeptsData);
        //根据登录用户设置页面数据
        this.userControl[this.userInfo.userRole].call(this);
      },
      () => {}
    );
  },
  methods: {
    changeEffectRange(val){ //修改有效范围
      this.showAcMapBefore();
    },
    confirmUsersAttendConM(){ //确认批量修改人员考勤配置信息
      //经纬度是否全为空
      var isAllEmpty = _.every(this.tmpConPersons,(item)=>{
        return item.latlng=="";
      });
      //是否都修改成一致
      var tmpSameObj = {};
      _.each(this.tmpConPersons,(item)=>{
        tmpSameObj[item.latlng]= 1;
      },this);
      //console.log(tmpSameObj);
      if(_.size(tmpSameObj)>1||isAllEmpty||!this.isMultipleOpe){
        this.$message({type:"warning",message:"请重新选择考勤范围（批量设置）"});
        return;
      }
      //return;
      //批量编辑
      this.$confirm("确定要将所选地图区域设置为所选人员的考勤范围吗？", '提示',{
        type:"warning"
      }).then(()=>{
        fjPublic.openLoad("正在批量配置...","body");
        var userIds = _.pluck(this.tmpConPersons,"userId");
        var deptIds = _.pluck(this.tmpConPersons,"deptId");
        var latlngs = _.pluck(this.tmpConPersons,"latlng");
        var signScopes = _.pluck(this.tmpConPersons,"signScope");
        var addresses = _.pluck(this.tmpConPersons,"address");
        var modifyData = {
          "nowUser":this.operateArgs.nowUser,  //当前登录用户对象（必传）
          "userIdArr":userIds.join(","), //用户id按逗号拼接（必传）
          "deptIdArr":deptIds.join(","), //部门id按逗号拼接（必传）
          "latlngArr":latlngs.join(";"), //考勤经纬按;拼接（必传）	 	
          "addressArr":addresses.join(","), //考勤地点按逗号拼接（必传）
          "signScopeArr":signScopes.join(","), //考勤范围按逗号拼接（必传）
        };
        console.log(modifyData);
        //return;
        this.sendAttendConAjax(modifyData).always(()=>{
          fjPublic.closeLoad();
        });
      }).catch(()=>{
        
      });
    },
    confirmUserAttendCon(){ //确认修改人员考勤配置信息
      //是否已修改位置信息
      if(this.tmpMultipleInfo.address==this.tmpConInfo.address
        &&this.tmpMultipleInfo.latlng==this.tmpConInfo.latlng
        &&this.tmpMultipleInfo.signScope==this.tmpConInfo.signScope){
          this.$message({type:"warning",message:"未重新选择考勤范围"});
          return;
      }
      if(this.tmpConInfo.signScope>=5000){
        this.$message({type:"warning",message:"最大考勤范围半径不能高于5000米"});
        return;
      }
      //批量编辑的时候->只在地图上选点
      if(this.isMultiple){
        //修改所有选中人员的经纬度，范围，地址
        _.each(this.tmpConPersons,(item,i)=>{
          this.$set(item,"address",this.tmpConInfo.address);
          this.$set(item,"latlng",this.tmpConInfo.latlng);
          this.$set(item,"signScope",this.tmpConInfo.signScope);
          this.$set(item,"signScope2",(this.tmpConInfo.signScope/1000).toFixed(1)+"公里");
        },this);
        this.isMultipleOpe = true; //已批量编辑过
        this.attendConMapPop = false;
        return;
      }
      console.log(this.tmpConInfo);
      this.$confirm("确定要将该地图区域设置为"+this.tmpConInfo.username+"的考勤范围吗？", '提示',{
        type:"warning"
      }).then(()=>{
        var vm = this;
        if(!this.tmpConInfo.signScope){
          this.tmpConInfo["signScope"] = 1000;
        }
        fjPublic.openLoad("正在配置...","body");
        //是否批量编辑
        var modifyData = {
          "nowUser":this.operateArgs.nowUser,  //当前登录用户对象（必传）
          "userIdArr":this.tmpConInfo.userId, //用户id按逗号拼接（必传）
          "deptIdArr":this.tmpConInfo.deptId, //部门id按逗号拼接（必传）
          "latlngArr":this.tmpConInfo.latlng, //考勤经纬按;拼接（必传）	 	
          "addressArr":this.tmpConInfo.address, //考勤地点按逗号拼接（必传）
          "signScopeArr":this.tmpConInfo.signScope, //考勤范围按逗号拼接（必传）
        };
        console.log(modifyData);
        //return;
        //单个编辑
        this.sendAttendConAjax(modifyData).always(()=>{
          fjPublic.closeLoad();
        });
      }).catch(()=>{
        
      });
    },
    sendAttendConAjax(infoData,str){ //发送修改请求
      return $.Deferred((defer)=>{
        var vm = this;
        var txt = str?str:"";
        $.ajax({
          url:
            fjPublic.ajaxUrlDNN +
            "/attendanceConfig/setAttendanceConfig",
          type: "POST",
          data:infoData,
          dataType: "json",
          success: function(data) {
            console.log(data);
            if (data.errorCode == 0) {
              vm.$message({ type: "success", message: txt+"配置成功" });
              vm.currentPage = 1;
              vm.getAttendPersonsData().then(()=>{
                vm.attendConMapPop = false;
                vm.attendConPop = false;
                vm.$nextTick(()=>{
                  fjPublic.removeModalMask();
                });
              });
            } else {
              vm.$message({ type: "warning", message: txt+"配置失败" });
            }
            defer.resolve();
          },
          error: function(err) {
            vm.$message({ type: "warning", message: txt+"配置失败" });
            defer.reject();
          }
        });
      }).promise();
    },
    closeAttendConPop(){ //关闭考勤配置弹层
      this.isMultipleOpe = false;
      this.isMultiple = false;
      this.attendConPop = false;
      fjPublic.removeModalMask();
    },
    getVmodalZindex(){
      return parseInt($(".v-modal",this.$el).last().css("z-index"));
    },
    getInitLngLat(){ //获取初始的经纬度
      var lnglat;
      var pos ={
        lngNum:"",
        latNum:""
      };;
      if(!this.tmpConInfo.latlng){
        lnglat = fjPublic.cityInfos.coordinates.split(",");
        pos.lngNum = parseFloat(lnglat[1].split(":")[1]);
        pos.latNum = parseFloat(lnglat[0].split(":")[1]);
      }else{
        lnglat = this.tmpConInfo.latlng.split(",");
        pos.lngNum = parseFloat(lnglat[0]);
        pos.latNum = parseFloat(lnglat[1]);
      }
      return pos;
    },
    showAcMapBefore(){ //在显示地图之前
      if(this.circle&&this.text&&this.circleEditor){
        if(this.effectRange){
          var lngNum,latNum;
          var pos = this.getInitLngLat();
          lngNum = pos.lngNum;
          latNum = pos.latNum;
          this.circle.setRadius(this.effectRange);
          this.setERTextInfo(this.effectRange+"米",lngNum,latNum);
          this.circleEditor.close();
          this.tmpConInfo["tmpSignScope"] = this.tmpConInfo["signScope"];
          this.tmpConInfo["signScope"] = this.effectRange;
        }else{
          this.text.setMap(null);
          this.circleEditor.open();
          if(this.tmpConInfo.hasOwnProperty("tmpSignScope")){
            this.tmpConInfo["signScope"] = this.tmpConInfo["tmpSignScope"];
          }
          this.circle.setRadius(this.tmpConInfo.signScope);
        }
      }
    },
    showAcMap(){ //显示地图
      this.posAddress = this.tmpConInfo["address"];
      this.attendConMapPop = true;
      this.tmpConInfo["tmpSignScope"] = this.tmpConInfo["signScope"];
      this.showAcMapBefore();
      this.$nextTick(()=>{
        //设置地图弹层的z-index
        this.acMapDom.css("z-index",this.getVmodalZindex()+1);
        var vm = this;
        //创建marker,circle,infoWin,text
        this.setMarker();
        this.setInfoWin();
        this.setCircle();
        this.setERText();
        //初始中心点坐标
        var lngNum,latNum;
        var pos = this.getInitLngLat();
        lngNum = pos.lngNum;
        latNum = pos.latNum;
        if(!this.acMap){
          this.acMap = new AMap.Map('posMap', {
            zooms:[14,18],
            zoom:14,//级别
            center: [lngNum,latNum]//中心点坐标
          });
          //设置acMap点击事件
          AMap.event.addListener(this.acMap,"click",(info)=>{
            //console.log(info);
            var lngNum = info.lnglat.lng,
                latNum = info.lnglat.lat;
            fjPublic.openLoad("解析地址...","body");
            vm.getLngLatAddress(lngNum,latNum).then((data)=>{
              fjPublic.closeLoad();
              vm.posAddress = "";
              //console.log(data);
              vm.setAcMapCenter(lngNum,latNum);
              vm.setMarkerPos(lngNum,latNum);
              vm.setCirclePos(lngNum,latNum); 
              vm.setInfoWinInfo(data.regeocode.formattedAddress,lngNum,latNum);
              vm.setERTextPos(lngNum,latNum);
              //修改tmpConInfo
              vm.tmpConInfo["latlng"] = [lngNum,latNum].join(",");
              vm.tmpConInfo["address"] = data.regeocode.formattedAddress;
              vm.posAddress = vm.tmpConInfo["address"];
            },()=>{
              fjPublic.closeLoad();
              vm.$message({type:"warning",message:"解析经纬度地址失败"});
            });
          });
        }
        //设置marker,circle,infoWin的position
        this.setAcMapCenter(lngNum,latNum);
        this.setMarkerPos(lngNum,latNum);
        this.setCirclePos(lngNum,latNum);
        this.setInfoWinInfo(this.tmpConInfo.address||"未设置",lngNum,latNum);
        //地址解码
        if(!this.geocoder){
          AMap.plugin("AMap.Geocoder",()=>{
            this.geocoder = new AMap.Geocoder({
              city:fjPublic.cityInfos.citiName
            });
          });
        }
        //自动搜索
        if(!this.acAutoComplete){
          AMap.plugin('AMap.Autocomplete',()=>{
            // 实例化Autocomplete
            var autoOptions = {
              // input 为绑定输入提示功能的input的DOM ID
              input: 'acAutoComplete',
              city:fjPublic.cityInfos.citiName,
              citilimit:true
            }
            this.acAutoComplete = new AMap.Autocomplete(autoOptions);
            //加事件
            AMap.event.addListener(this.acAutoComplete,"complete",_.debounce((a)=>{
              //console.log(a);
            },200));
            //选择某个搜索出来的地址
            AMap.event.addListener(this.acAutoComplete,"select",(info)=>{
              //console.log(info);
              if(!info.poi.location){
                vm.$message({type:"warning",message:"所选地点范围太广,请缩小范围！"});
                return;
              }
              //详细地址
              var selectAddress = info.poi.district + info.poi.address + info.poi.name;
              vm.posAddress = info.poi.name;
              //
              var lngNum = info.poi.location.lng,
                  latNum = info.poi.location.lat;
              vm.setAcMapCenter(lngNum,latNum);
              vm.setMarkerPos(lngNum,latNum);
              vm.setCirclePos(lngNum,latNum); 
              vm.setInfoWinInfo(selectAddress,lngNum,latNum);
              vm.setERTextPos(lngNum,latNum);
              //修改tmpConInfo
              vm.tmpConInfo["latlng"] = [lngNum,latNum].join(",");
              vm.tmpConInfo["address"] = selectAddress;
              //console.log(vm.posAddress);
            });
          });
        }
        //圆形编辑->设置考勤范围
        if(!this.circleEditor){
          AMap.plugin("AMap.CircleEditor",()=>{
            this.circleEditor = new AMap.CircleEditor(this.acMap,this.circle);
            this.circleEditor.open();
            //adjust事件
            AMap.event.addListener(this.circleEditor,"adjust",_.debounce((e)=>{
              //console.log(e);
              //修改tmpConInfo
              vm.tmpConInfo["signScope"] = e.radius;
            },200));
          });
        }
      });
    },
    getLngLatAddress(lng,lat){ //逆向解析经纬度地址
      return $.Deferred((defer)=>{
        var vm = this;
        this.geocoder.getAddress(new AMap.LngLat(lng,lat),(status,result)=>{
          if(status==="complete"&&result.info==="OK"){
            defer.resolve(result);
          }else{
            defer.reject();
          }
        })
      }).promise();
    },
    setERText(){ //设置有效范围文字提示
      if(!this.text){
        this.text = new AMap.Text({
          text:"",
          anchor:"top-left",
        });
        this.text.setStyle({
          "background":"rgba(0,0,0,0.75)",
          "border":"1px solid rgba(0,0,0,0)",
          "font-size":"14px",
          "color":"#fff"
        });
      }
    },
    setERTextInfo(content,lng,lat){
      if(this.text){
        this.text.setMap(this.acMap);
        this.text.setText(content);
        this.setERTextPos(lng,lat);
      }
    },
    setERTextPos(lng,lat){
      //根据距离差计算text的经纬度
      if(this.effectRange){
        var curLngLat = new AMap.LngLat(lng,lat);
        var textLngLat = curLngLat.offset(this.effectRange,0);
        this.text.setPosition(textLngLat);
      }
    },
    setAcMapCenter(lng,lat){ //设置地图中心点
      this.acMap.setCenter(new AMap.LngLat(lng,lat));
    },
    setMarker(){ //设置位置标记
      if(!this.marker){
        this.marker = new AMap.Marker({
          icon:"static/images/fj-attend-marker.png",
          anchor:"center",
          offset:new AMap.Pixel(0,0)
        });
      }
    },
    setMarkerPos(lng,lat){ //设置位置标记position
      if(this.marker){
        this.marker.setMap(this.acMap);
        this.marker.setPosition(new AMap.LngLat(lng,lat));
      }
    },
    setCircle(){ //设置圆形标记
      if(!this.circle){
        this.circle = new AMap.Circle({  
          radius:0,//this.operateArgs.minSignScope,  //半径(米)
          strokeColor: "rgb(24,144,255)",  //线颜色
          strokeOpacity: 1,  //线透明度
          strokeWeight: 1,  //线粗细度
          fillColor: "rgba(128,191,255)",  //填充颜色
          fillOpacity: 0.1, //填充透明度
          bubble:true,
        });
        //点击circle时切换显示infoWin
        AMap.event.addListener(this.circle,"click",()=>{
          //this.toggleInfoWin?this.infoWin.close():this.infoWin.open(this.acMap);
          //this.toggleInfoWin = !this.toggleInfoWin;
        });
      }
    },
    setCirclePos(lng,lat){ //设置圆形标记position
      if(this.circle){
        this.circle.setMap(this.acMap);
        this.circle.setCenter(new AMap.LngLat(lng,lat));
        var radius;
        if(this.effectRange){
          radius = this.tmpConInfo.signScope?parseInt(this.tmpConInfo.signScope):0;
        }else{
          radius = this.tmpConInfo.signScope?parseInt(this.tmpConInfo.signScope):this.effectRange;
        }
        //console.log(radius);
        this.circle.setRadius(radius);
      }
    },
    setInfoWin(){ //设置信息提示框
      if(!this.infoWin){
        this.infoWin = new AMap.InfoWindow({
          isCustom:true,
          anchor:"center",
          offset:new AMap.Pixel(0,-42),
          showShadow:true
        });
      }
    },
    setInfoWinInfo(content,lng,lat){ //设置信息提示框position及content
      if(this.infoWin){
        this.infoWin.setContent('<p class="attendMapInfo0511">'+content+'</p>');
        this.infoWin.setPosition(new AMap.LngLat(lng,lat));
        this.infoWin.open(this.acMap);
      }
    },
    opePosConOfChoosen(data){ //批量配置 -> 选择位置
      console.log(data);
      //this.posAddress = "";
      this.tmpConInfo = null;
      this.tmpConInfo = data;
      this.tmpMultipleInfo = null;
      this.tmpMultipleInfo = _.extend({},data);
      this.showAcMap();
    },
    opePosConOfPersonMultiple(){  //批量配置 -> 位置
      if(!this.conPersons.length){
        this.$message({type:"warning",message:"请选择要配置的人员"});
        return;
      }
      //设置批量弹层的数据
      this.tmpConPersons.splice(0,this.tmpConPersons.length);
      _.each(this.conPersons,(item,i)=>{
        this.tmpConPersons.push(_.extend({},item));
        if(!this.tmpConPersons[i].address){
          this.$set(this.tmpConPersons[i],"address","未设置");
        }
      },this);
      this.attendConPop = true;
      this.isMultiple = true;
    },
    opePosConOfPersonSingle(data){ //单个配置 -> 位置
      //console.log(data);
      this.posAddress = "";
      this.tmpConInfo = null;
      this.tmpConInfo = _.extend({},data);
      this.tmpMultipleInfo = null;
      this.tmpMultipleInfo = _.extend({},data);
      //console.log(this.tmpConInfo);
      this.showAcMap();
    },
    getAttendanceConfigByUserId(userId){ //获取用户的考勤配置信息
      return $.Deferred((defer)=>{
        var vm = this;
        $.ajax({
          url:
            fjPublic.ajaxUrlDNN +
            "/attendanceConfig/getAttendanceConfigByUserId",
          type: "POST",
          data: {
            userId:userId
          },
          dataType: "json",
          success: function(data) {
            console.log(data);
            if (data.errorCode == 0) {
              defer.resolve(data.ac_info);
            } else {
              vm.$message({ type: "warning", message: "获取用户考勤配置信息失败" });
            }
          },
          error: function(err) {
            vm.$message({ type: "warning", message: "获取用户考勤配置信息失败" });
            defer.reject();
          }
        });
      }).promise();
    },
    handleSelectionChange(arr){ //配置考勤位置->多选
      //console.log(arr);
      this.conPersons = null;
      this.conPersons = arr;
      //console.log(this.conPersons);
    },
    setColumnWidth() {
      //设置列宽->地址
      var cw = $(window).innerWidth();
      if (cw <= 1366) {
        this.columnsWidth["useraccount"] = "182";
        this.columnsWidth["address"] = "464";
      } else {
        this.columnsWidth["useraccount"] = "202";
        this.columnsWidth["address"] = "564";
      }
    },
    getAttendPersonsData(id,isAll) {
      if(isAll)return;
      //获取列表数据
      (id)&&(this.operateArgs.deptId = id);
      return $.Deferred(defer => {
        var vm = this;
        $.ajax({
          url:
            fjPublic.ajaxUrlDNN +
            "/attendanceConfig/searchAttendanceConfigByPage",
          type: "POST",
          data: {
            nowUser: this.operateArgs.nowUser,
            userId: "", //非必传
            deptId: this.operateArgs.deptId,
            page: this.currentPage, //页码
            rows: this.pageSize //每页条数
          },
          dataType: "json",
          success: function(data) {
            //console.log(data);
            if (data.errorCode == 0) {
              vm.total = data.total;
              //范围距离换算-> 米2公里
              _.each(data.rows,(item)=>{
                if(item.signScope){
                  item.signScope2 = (item.signScope/1000).toFixed(1)+"公里";
                }else{
                  item.signScope2 = "-";
                }
              });
              vm.acData = null;
              vm.acData = data.rows;
            } else {
              vm.$message({ type: "warning", message: "获取列表数据失败" });
            }
            defer.resolve();
          },
          error: function(err) {
            vm.$message({ type: "warning", message: "获取列表数据失败" });
            defer.reject();
          }
        });
      }).promise();
    },
    getAttendPersonsDataByPcsId(id){ //根据派出所id查询数据
      fjPublic.openLoad("获取数据...");
      this.getAttendPersonsData(id?id:this.attendFenjvId).always(()=>{
        fjPublic.closeLoad();
      });
    },
    getPCSdataById(id,isAll) {
      if (!id) {
        //清空的时候，清除对应派出所数据
        this.clearPcsData();
        this.clearAcData();
        this.attendPcsId = "";
        return;
      }
      fjPublic.openLoad("获取数据...");
      var vm = this;
      this.attendPcsId = "";
      this.currentPage = 1;
      return $.Deferred((defer)=>{
        var vm = this;
        $.when(
          $.ajax({
            url: fjPublic.ajaxUrlDNN + "/searchDeptsByFenju",
            type: "POST",
            data: {
              flag: "1",
              parentDeptId: id //根据分局id
            },
            dataType: "json",
            success: function(data) {
              //console.log(data);
              vm.SLdeptsData = null;
              vm.SLdeptsData = data.list;
            },
            error: function(err) {
            }
          }),
          //获取对应分局的列表数据
          this.getAttendPersonsData(id,isAll)
        ).then(()=>{
          fjPublic.closeLoad();
          defer.resolve();
        },()=>{
          fjPublic.closeLoad();
          defer.reject();
        });
      }).promise();
      
    },
    clearAcData(){ //清空列表数据
      this.acData.splice(0,this.acData.length); 
    },
    clearPcsData() {
      //清空派出所数据
      this.SLdeptsData.splice(0, this.SLdeptsData.length);
    },
    getDepListBySearch() {
      //获取区县分局数据--联动选择用
      var defer = $.Deferred();
      var vm = this;
      $.ajax({
        url: fjPublic.ajaxUrlDNN + "/searchDepListBySearch",
        type: "POST",
        data: {},
        dataType: "json",
        success: function(data) {
          //console.log(data);
          vm.FLdeptsData = _.filter(data.list, function(item) {
            return item.deptId != fjPublic.cityInfos.deptId;
          });
          defer.resolve();
        },
        error: function(err) {
          defer.reject();
        }
      });
      return defer;
    },
    currentPageChange: function(pageNum) {
      //点击某个分页按钮
      // pageNum  当前的页码值
      this.currentPage = pageNum;
      this.getAttendPersonsData();
    },
    prevPageChange: function(pageNum) {
      //点击分页的上一页
      // pageNum  当前页--后的值
      this.currentPage = pageNum;
      this.getAttendPersonsData();
    },
    nextPageChange: function(pageNum) {
      //点击分页的下一页
      // pageNum  当前页++后的值
      this.currentPage = pageNum;
      this.getAttendPersonsData();
    },
    sizePageChange: function(pageSize) {
      //改变每页条数时
      // pageSize 每页条数
    },
    requestDatas() {
      //向后台请求数据
      return $.Deferred(defer => {
        var vm = this;
        fjPublic.openLoad("数据加载中...");
        $.when(
          this.getDepListBySearch()).then(
          function() {
            defer.resolve();
          },
          function() {
            vm.$message({
              type: "warning",
              message: "请求数据失败！！！"
            });
            _.delay(function() {
              fjPublic.closeLoad();
              vm.$router.push("/500");
            }, 2000);
          }
        );
      }).promise();
    }
  },
  components: {
    fjBreadNav
  }
};
</script>
<style lang="less">
.fj-content_view.attend-configure {
  #attendConPop {
    .el-dialog__header {padding-left:56px;}
    .el-dialog__title {color:rgba(0,0,0,.85);}
    .fj-block-body {
      &.footer {text-align:center;}
      &.body {padding:0px 36px;}
      .el-table th,.el-table td {
        padding:12px 0px;
      }
      .el-table .ope-txt {text-decoration:underline;}
    }
  }
  /* 地图 */
  #attendConMapPop {
    position:fixed;top:0;left:0;bottom:0;left:0;right:0;z-index:2100;
    .inner {width:100%;height:100%;}
    .operate-line {
      position:absolute;top:60px;left:70px;font-size:0;
      &>.mr20 {margin-right:20px;}
      &>.mr60 {margin-right:60px;}
      .el-button,.el-input input {
        box-shadow:3px 0px 10px rgba(0,0,0,0.28);
      }
      .el-button+.el-button {margin-left:20px;}
      .el-select,.el-input {width:260px;}
      .el-input.searchAddress {width:290px;}
      .el-input--suffix .el-input__inner {padding-right:18px;}
      i.el-icon-location {padding-left:4px;line-height:32px;}
    }
  }
  .attendMapInfo0511 {
    position:relative;
    min-width:124px;max-width:320px;
    min-height:32px;padding:8px;
    background:rgba(0,0,0,0.75);
    border:1px solid rgba(0,0,0,0);color:#fff;font-size:12px;line-height:16px;
    box-shadow:0px 2px 8px rgba(0,0,0,0.15);text-align:center;border-radius:2px;
    &:after {
      content:'';position:absolute;left:50%;margin-left:-6px;bottom:-12px;
      width:0;height:0;border:6px solid transparent;border-top-color:rgba(0,0,0,0.75);
    }
  }
}
</style>


