$.ajax({
    url: "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?ServiceKey=LT6VnxOUwUNb37cM174qWbxEd3Kew7Vt098vERT%2FocjVCJWNddkGe%2F4qlUUkSvOlD1SDOvf2ttKNShm906EFng%3D%3D&_type=json&startCreateDt=20220108&endCreateDt=20220108",
    method: "get",
    success: function (res) {
        console.log(res);
        const cities = [];
        const coronaIncDec = [];
        const backgroundList = [];
        const borderList = [];
        const coronaData = res.response.body.items.item;
        $.each(coronaData, function (i, item) {
            console.log(item.gubun + "===" + item.incDec);
            cities.push(item.gubun);
            coronaIncDec.push(item.incDec);
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            backgroundList.push(`rgba(${r},${g},${b},1)`);
            borderList.push(`rgba(${r},${g},${b},1)`);
        });

        const ctx = document.querySelector("#myChart").getContext("2d");
        const myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: cities,
                datasets: [
                    {
                        label: "시도별 CORONA 발생현황",
                        data: coronaIncDec,
                        backgroundColor: backgroundList,
                        borderColor: borderList,
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
            },
        });
    },
});

const days = ["sun", "mon", "tue", "wed", "thur", "fri", "sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "Auguest", "September", "October", "November", "December"];
const leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const notLeapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const now = new Date();
function makeCalendar(_year, _month) {
    const startDate = new Date(_year, _month, 1);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDay(); //0~6
    let selectedYear;

    if (startYear % 4 === 0) {
        //4로떨어지면 윤년
        if (startYear % 100 === 0) {
            selectedYear = notLeapYear;
            if (startYear % 400 === 0) {
                selectedYear = leapYear;
            }
        } else {
            selectedYear = leapYear;
        }
    } else {
        selectedYear = notLeapYear;
    }
    let output = "";
    let count = 1;
    for (let i = 0; i < 42; i++) {
        if (i < startDay) {
            output += `<li class="blank"><span></span></li>`;
        } else {
            output += `<li><span>${count}</span></li>`;
            count++;
        }
        if (count > selectedYear[startMonth]) break;
    }
    console.log(output);
    $("#calendar .dates .list").html(output);
}

makeCalendar(2022, 0);
