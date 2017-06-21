전기 사용량에 따른 전기요금을 계산하고, 역으로 전기 요금에 따른 전기 사용량을 구할 수 있는 javascript plugin 입니다.
현재는 가정용(저압/고압)만 계산 가능합니다.

# Korea-Electricity-Fee

## Return Value
```
// new ElectricityFee().getFeeDetail(320);

{
    basic_charge: 1600, // 기본요금
    usage_charge: 41208, // 사용요금
    total_charge: 42808, // 전기요금계(기본요금 + 사용요금)
    tax: 4281, // 부가가치세
    foundation_fund: 1580, // 전력산업기반기금
    amount: 48660 // 청구요금 합계
}
```

## Usage

```
<script src="Korea-Electricity-Fee.js"></script>
<script>
var ef = new ElectricityFee();

// 320khw 사용시 요금을 반환
ef.getFeeDetail(320).amount; // 48660

// 50000원 요금이 나온 경우 몇 kwh를 썼는지 근사치에 가까우면서 작은 값을 반환
ef.getUsageByAmount(50000).usage;   // 326

// 위와 같으나 근사치에 가까우면서 큰 값을 반환
ef.getUsageByAmount(50000, false).usage;   // 327
</script>
```

## License
MIT license
