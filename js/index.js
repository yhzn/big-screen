window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
let getHeight = (dom,num) => {
    return (parseFloat(window.getComputedStyle(dom).height)/num).toFixed(2);
}

new Vue({
    el: '#app',
    data: {
        leftUpScroll:0,
        leftDownScroll:0,
        rightUpScroll:0,
        rightDownScroll:0,
        speed:.5,
        leftUpData:[],
        leftDownData:[],
        rightUpData:[],
        rightDownData:[],
        leftUpTemp:[],
        leftDownTemp:[],
        rightUpTemp:[],
        rightDownTemp:[],
        leftUpDataLength:0,
        leftDownDataLength:0,
        rightUpDataLength:0,
        rightDownDataLength:0,
        leftUpDom:null,
        leftDownDom:null,
        rightUpDom:null,
        rightDownDom:null,
        refreshCount:0,
        refreshTime:60,
    },
    mounted () {
        let _this=this;
        this.leftUpDom=this.$refs.leftUpScroll;
        this.leftDownDom=this.$refs.leftDownScroll;
        this.rightUpDom=this.$refs.rightUpScroll;
        this.rightDownDom=this.$refs.rightDownScroll;

        this.leftUpHeight=getHeight(this.$refs.leftUpScroll,6);
        this.leftDownHeight=getHeight(this.$refs.leftDownScroll,4);
        this.rightDownHeight=this.rightUpHeight=getHeight(this.$refs.rightUpScroll,5);

        this.getData();
        window.onresize=function(){
            _this.leftUpHeight=getHeight(_this.$refs.leftUpScroll,6);
            _this.leftDownHeight=getHeight(_this.$refs.leftDownScroll,4);
            _this.rightDownHeight=_this.rightUpHeight=getHeight(_this.$refs.rightUpScroll,5);
        }
        window.requestAnimationFrame(this.animation);

    },
    methods:{
        animation () {
            this.scroll("leftUp",6);
            this.scroll("leftDown",4);
            this.scroll("rightUp",5);
            this.scroll("rightDown",5);
            this.refreshData();
            window.requestAnimationFrame(this.animation);
        },
        refreshData () {
            this.refreshCount++;
            if(this.refreshCount>=this.refreshTime*60){
                this.getData();
                this.refreshCount=0;
            }
        },
        scroll (p,l) {
            if(this[`${p}DataLength`]>l*2){
                if(this[`${p}Scroll`]>this[`${p}DataLength`]*this[`${p}Height`]/2){
                    this.cache(p);
                    this[`${p}Scroll`]=0;
                }
                this[`${p}Scroll`]+=this.speed;
                this[`${p}Dom`].scrollTop=this[`${p}Scroll`];
            }else{
                this.cache(p);
                this[`${p}Scroll`]=0;
            }
        },
        doubleData (p,l,data) {
            if(data.length>l){
                this[`${p}Temp`]=[...data,...data];
            }else{
                this[`${p}Temp`]=data;
            }
        },
        cache (p) {
            if(this[`${p}Temp`].length!==0){
                this[`${p}Data`]=this[`${p}Temp`];
                this[`${p}DataLength`]=this[`${p}Temp`].length;
                this[`${p}Temp`]=[];
            }
        },
        getData () {
            $.ajax({
                url:"/returnNews",
                success:(data) => {
                    this.doubleData("leftUp",6,data.expertFull);
                    this.doubleData("leftDown",4,data.departmentFull);
                    this.doubleData("rightUp",5,data.morningClose);
                    this.doubleData("rightDown",5,data.afternoonClose);
                },
                error:(err) => {
                    console.log(err);
                }
            })
        }

    }
});