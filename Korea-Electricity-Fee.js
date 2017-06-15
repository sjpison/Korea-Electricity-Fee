/**
Korea-Electricity-Fee.js
Developed by: Pison	(codemission.org)
**/

(function() {
    /* ElectricityFee */
    this.ElectricityFee = function() {
        var defaults = {
            "type" : "kr-residential-low" // 가정용 저압
        };

        if (arguments[0] && typeof arguments[0] === "object") {
            this.options = function(source, properties) {
                var property;
                for (property in properties) {
                    if (properties.hasOwnProperty(property)) {
                        source[property] = properties[property];
                    }
                }
                return source;
            }(defaults, arguments[0]);
        } else {
            this.options = defaults;
        }

        this._elec_const = {
            'kr-residential-low' : {
                // [0~ / 200~ / 400~] kWh
                interval:[0, 200, 400],
                basic_section:[910, 1600, 7300],
                usage_section:[93.3, 187.9, 280.6]
            }
        }
    }

    /* getFeeDetail */
    ElectricityFee.prototype.getFeeDetail = function(kwh) {
        var elec_con = this._elec_const[this.options.type];

        var ret = {
            error:false,
            message:"",
            usage:kwh,
            basic_charge:0,
            usage_charge:0,
            total_charge:0,
            tax:0,
            foundation_fund:0,
            amount:0
        };
        if(this.options.type=="kr-residential-low") {
            for(var i=0; i<elec_con.interval.length;i++) {

                // 사용량이 현재 구간을 초과한 경우
                if(elec_con.interval[i+1] && elec_con.interval[i+1] < kwh) {
                    ret.usage_charge += (elec_con.interval[i+1]-elec_con.interval[i]) * elec_con.usage_section[i];
                }
                // 다음 구간 값이 없거나, 현재 구간 내에 존재하는 경우
                else {
                    ret.basic_charge += elec_con.basic_section[i]; // 기본요금 지정
                    ret.usage_charge += (kwh - elec_con.interval[i]) * elec_con.usage_section[i];
                    break;
                }
            }
            ret.total_charge = ret.basic_charge + ret.usage_charge;
            ret.tax = Math.round(ret.total_charge/10); // 부가세
            ret.foundation_fund = Math.floor(ret.total_charge*0.0037)*10; // 기반기금
            ret.amount = Math.floor((ret.total_charge + ret.tax + ret.foundation_fund)/10)*10; // 청구금액
            ret.message = "Success";

            return ret;
        } else {
            ret.error = true;
            ret.message = "Fail, type not defined";
        }
    }

    /* get Reverse */
    ElectricityFee.prototype.getUsageByAmount = function(amount, under) {
        under = typeof under == 'undefined' ? true : under;

        var elec_con = this._elec_const[this.options.type];

        var amount_list = [];
        elec_con.interval.forEach(function(v) {
            amount_list.push(this.getFeeDetail(v+1));
        }, this);

        // 현재 요금에서 가장 가까운 값 추출
        // 소스 개선이 필요해 보이지만, 최근 컴퓨터들의 연산능력을 고려하면 충분히 빠름
        var tmp_detail = 0;
        while(amount_list.length>0) {
            tmp_detail = amount_list.pop();
            if(tmp_detail.amount < amount) {
                break;
            }
        }

        // kwh 를 더해 가면서 가장 가까운 값 return
        while(tmp_detail.amount < amount) {
            tmp_detail = this.getFeeDetail(tmp_detail.usage+1);
        }
        
        if(under)
            return this.getFeeDetail(tmp_detail.usage-1);
        else
            return this.getFeeDetail(tmp_detail.usage);
    }
})();