
using System;
using System.Globalization;

namespace SamPeng.IChing.ChineseCalendar
{
    class ChineseCalendarDate
    {
        readonly DateTime baseDate = new DateTime(1900, 1, 31);
        readonly int chineseTwoHourPeriod;
        readonly int day;
        readonly bool isLeapMonth;
        readonly int month;
        readonly int year;

        public ChineseCalendarDate(DateTime dateTime)
        {
            chineseTwoHourPeriod = GetChineseTwoHourPeriod(dateTime);
            if (dateTime.Hour == 23) //11 pm, starts next day.
            {
                dateTime = dateTime.AddDays(1);
            }
            #region black magic here -- copied form internet resources
            //black box algorthm below....
            //------------------------------
            //求出和1900年1月31日相差的天数   
            int offset = (dateTime - baseDate).Days;
            int dayCyl = offset + 40;
            int monCyl = 14;

            //用offset减去每农历年的天数   
            // 计算当天是农历第几天   
            //i最终结果是农历的年份   
            //offset是当年的第几天   
            int iYear, daysOfYear = 0;
            for (iYear = 1900; iYear < 2050 && offset > 0; iYear++)
            {
                daysOfYear = ChineseCalendarInfo.YearDays(iYear);
                offset -= daysOfYear;
                monCyl += 12;
            }
            if (offset < 0)
            {
                offset += daysOfYear;
                iYear--;
                monCyl -= 12;
            }
            //农历年份   
            year = iYear;

            int leapMonth = ChineseCalendarInfo.LeapMonth(iYear); //闰哪个月,1-12   
            isLeapMonth = false;

            //用当年的天数offset,逐个减去每月（农历）的天数，求出当天是本月的第几天   
            int iMonth, daysOfMonth = 0;
            for (iMonth = 1; iMonth < 13 && offset > 0; iMonth++)
            {
                //闰月   
                if (leapMonth > 0 && iMonth == (leapMonth + 1) && !isLeapMonth)
                {
                    --iMonth;
                    isLeapMonth = true;
                    daysOfMonth = ChineseCalendarInfo.LeapDays(year);
                }
                else
                    daysOfMonth = ChineseCalendarInfo.MonthDays(year, iMonth);

                offset -= daysOfMonth;
                //解除闰月   
                if (isLeapMonth && iMonth == (leapMonth + 1)) isLeapMonth = false;
                if (!isLeapMonth) monCyl++;
            }
            //offset为0时，并且刚才计算的月份是闰月，要校正   
            if (offset == 0 && leapMonth > 0 && iMonth == leapMonth + 1)
            {
                if (isLeapMonth)
                {
                    isLeapMonth = false;
                }
                else
                {
                    isLeapMonth = true;
                    --iMonth;
                    --monCyl;
                }
            }
            //offset小于0时，也要校正   
            if (offset < 0)
            {
                offset += daysOfMonth;
                --iMonth;
                --monCyl;
            }
            month = iMonth;
            day = offset + 1;
            //------------------------------
            #endregion
        }

        public int ChineseTwoHourPeriod
        {
            get { return this.chineseTwoHourPeriod; }
        }

        public string ChineseTwoHourPeriodString
        {
            get { return ChineseCalendarInfo.EarthlyBranches[this.chineseTwoHourPeriod - 1]; }
        }

        public int Day
        {
            get { return this.day; }
        }

        public string EarthlyBranchString
        {
            get
            {
                return ChineseCalendarInfo.EarthlyBranches[EarthlyBranchValue - 1];
            }
        }

        public int EarthlyBranchValue
        {
            get
            {
                return (this.year - 1900 + 36) % 12 + 1;
            }
        }

        public string HeavenlyStemString
        {
            get
            {
                return ChineseCalendarInfo.HeavenlyStems[(this.year - 1900 + 36) % 10];
            }
        }

        public bool IsLeapMonth
        {
            get { return this.isLeapMonth; }
        }

        public int Month
        {
            get { return this.month; }
        }

        //农历 y年的生肖   
        public string YearAnimalSign
        {
            get
            {
                return ChineseCalendarInfo.AnimalSigns[(year - 4) % 12];
            }
        }

        static int GetChineseTwoHourPeriod(DateTime dateTime)
        {
            int hr = dateTime.Hour + 1;
            hr = hr == 24 ? 0 : hr;
            return hr / 2 + 1;
        }

        public override string ToString()
        {
            string format = "{0}{1}({2})"+ Resources.Main.ChineseCharYear+
                "{3}{4}"+Resources.Main.ChineseCharMonth+
                "{5}"+Resources.Main.ChineseCharDay+
                "{6}"+Resources.Main.ChineseCharHour;

            return string.Format(CultureInfo.InvariantCulture,
                format,
                HeavenlyStemString,
                EarthlyBranchString,
                YearAnimalSign,
                IsLeapMonth ? Resources.Main.ChineseCharLeap : string.Empty,
                ChineseCalendarInfo.ToChineseNumber(Month),
                ChineseCalendarInfo.ToChineseNumber(Day),
                ChineseTwoHourPeriodString);
        }
        /** */
        /**  
* 传出y年m月d日对应的农历.  
* yearCyl3:农历年与1864的相差数              ?  
* monCyl4:从1900年1月31日以来,闰月数  
* dayCyl5:与1900年1月31日相差的天数,再加40      ?  
* @param cal   
* @return   
*/
        























    }
}
