let myChart = null;
function loadCorona(_date) {
    $.ajax({
        url: `http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19SidoInfStateJson?ServiceKey=LT6VnxOUwUNb37cM174qWbxEd3Kew7Vt098vERT%2FocjVCJWNddkGe%2F4qlUUkSvOlD1SDOvf2ttKNShm906EFng%3D%3D&_type=json&startCreateDt=${_date}&endCreateDt=${_date}`,
        method: "get",
        success: function (res) {
            // console.log(res);
            const cities = [];
            const coronaIncDec = [];
            const backgroundList = [];
            const borderList = [];
            const coronaData = res.response.body.items.item;
            $.each(coronaData, function (i, item) {
                // console.log(item.gubun + "===" + item.incDec);
                cities.push(item.gubun);
                coronaIncDec.push(item.incDec);
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                backgroundList.push(`rgba(${r},${g},${b},1)`);
                borderList.push(`rgba(${r},${g},${b},1)`);
            });

            const ctx = document.querySelector("#myChart").getContext("2d");
            if (myChart !== null) myChart.destroy();
            myChart = new Chart(ctx, {
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
}

const days = ["sun", "mon", "tue", "wed", "thur", "fri", "sat"];
const months = ["January", "February", "March", "April", "May", "June", "July", "Auguest", "September", "October", "November", "December"];
const leapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const notLeapYear = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const now = new Date();
let changeNow = new Date();

function makeCalendar(_year, _month) {
    const startDate = new Date(_year, _month, 1);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDay(); //0~6
    let selectedYear;
    $(".yearAndMonth .year").text(startYear);
    //$(".yearAndMonth .month").text(months[startMonth].substring(0, 3));
    $(".yearAndMonth .month").text(months[startMonth]);
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
            if (startYear === now.getFullYear() && startMonth === now.getMonth() && count === now.getDate()) {
                output += `<li class="today"><span>${count}</span></li>`;
            } else if (
                (startYear > now.getFullYear() && startMonth > now.getMonth() && count > now.getDate()) ||
                (startYear === now.getFullYear() && startMonth > now.getMonth() && count > now.getDate()) ||
                (startYear === now.getFullYear() && startMonth === now.getMonth() && count > now.getDate())
            ) {
                output += `<li data-no="${count}" style="background-color:rgba(1,1,1,0.2) !important; cursor: auto;"><span>${count}</span></li>`;
            } else {
                output += `<li data-no="${count}"><span>${count}</span></li>`;
            }
            count++;
        }
        if (count > selectedYear[startMonth]) break;
    }
    // console.log(output);
    $("#calendar .days .list").html("");
    $.each(days, function (i, item) {
        $("#calendar .days .list").append(`<li><span>${item}<span></li>`);
    });
    $("#calendar .dates .list").html(output);
    gsap.from("#calendar .dates .list li", { scale: 0, ease: "power3", stagger: 0.02 });
}

function addZero(num) {
    if (num < 10) return "0" + num;
    else "" + num;
}

$("#calendar .dates .list").on("click", "li", function () {
    //event will "click", "li" => "li"가 동적으로 생성이 되므로 이렇게 작성해줘야함.
    // console.log($(this).data("no"));
    const coronaDate = changeNow.getFullYear() + addZero(changeNow.getMonth() + 1) + addZero($(this).data("no"));
    // console.log("coronaDate", coronaDate);
    $(this).addClass("pickedDay").siblings().removeClass("pickedDay");
    loadCorona(coronaDate);
});

$("#calendar .header .btnNextMonth").on("click", function () {
    changeNow = new Date(changeNow.getFullYear(), changeNow.getMonth() + 1, 1);
    makeCalendar(changeNow.getFullYear(), changeNow.getMonth());
});

$("#calendar .header .btnPrevMonth").on("click", function () {
    changeNow = new Date(changeNow.getFullYear(), changeNow.getMonth() - 1, 1);
    makeCalendar(changeNow.getFullYear(), changeNow.getMonth());
});

makeCalendar(changeNow.getFullYear(), changeNow.getMonth());

loadCorona(20220109);
