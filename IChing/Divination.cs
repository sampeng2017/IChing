
using System;
using SamPeng.IChing.BaGua;
using SamPeng.IChing.ChineseCalendar;

namespace SamPeng.IChing
{
    class Divination
    {
        public static Hexagram Divine()
        {
            var rand = new Random(DateTime.Now.Millisecond);
            int upper = rand.Next(1, 9);
            int lower = rand.Next(1, 9);
            int change = rand.Next(1, 7);

            return new Hexagram(Trigram.EightTrigrams[upper - 1], Trigram.EightTrigrams[lower - 1], change);
        }

        public static Hexagram DivineByTime(DateTime dateTime)
        {
            var lunarDate = new ChineseCalendarDate(dateTime);

            int upperValue = lunarDate.EarthlyBranchValue + lunarDate.Month + lunarDate.Day;
            int upperTrigramValue = upperValue % 8;
            if (upperTrigramValue == 0)
            {
                upperTrigramValue = 8;
            }
            var upperTrigram = Trigram.EightTrigrams[upperTrigramValue - 1];

            int lowerValue = upperValue + lunarDate.ChineseTwoHourPeriod;
            int lowerTrigramValue = lowerValue % 8;
            if (lowerTrigramValue == 0)
            {
                lowerTrigramValue = 8;
            }
            var lowerTrigram = Trigram.EightTrigrams[lowerTrigramValue - 1];

            int changing = lowerValue % 6;
            if (changing == 0)
            {
                changing = 6;
            }
            return new Hexagram(upperTrigram, lowerTrigram, changing);
        }

        public static Hexagram DivineNow()
        {
            return DivineByTime(DateTime.Now);
        }
    }
}
