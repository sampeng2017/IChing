
using System.Globalization;
using SamPeng.IChing.ChineseCalendar;

namespace SamPeng.IChing.BaGua
{
    class Hexagram
    {
        readonly int changingIndex;
        readonly Trigram lower;
        readonly Trigram upper;

        public Hexagram(Trigram upperTriGram, Trigram lowerTrigram, int changingIndex)
        {
            this.upper = upperTriGram;
            this.lower = lowerTrigram;
            this.changingIndex = changingIndex;
        }

        public Hexagram ChangesTo
        {
            get
            {
                int d = ChangingIndex > 3 ? ChangingIndex - 3 : ChangingIndex;
                var newGua = ExternalTrigram.Change(d);

                return new Hexagram(ChangingIndex > 3 ? newGua : upper, ChangingIndex > 3 ? Lower : newGua, ChangingIndex);
            }
        }

        public int ChangingIndex { get { return this.changingIndex; } }
        public string ChangingIndexName { get { return ChineseCalendarInfo.ToChineseNumber(this.changingIndex); } }
        public Trigram ExternalTrigram { get { return ChangingIndex > 3 ? Upper : Lower; } }
        public Trigram InternalTrigram { get { return ExternalTrigram == Upper ? Lower : Upper; } }
        public Trigram Lower { get { return this.lower; } }
        public string Name { get { return HexagramInfo.Hexagrams[Upper.Id - 1, Lower.Id - 1]; } }
        public int StoreSequence
        {
            get
            {
                return (Upper.Id - 1) * 8 + lower.Id;
            }
        }

        public int SymbolicNumber
        {
            get
            {
                return Upper.Id + Lower.Id + ChangingIndex;
            }
        }

        public Trigram Upper { get { return this.upper; } }

        public InternalExternalRelation GetInternalExternalRelation()
        {
            var tiYong = InternalTrigram.Attribute.GetRelation(ExternalTrigram.Attribute);

            if (tiYong.Relation == FivePhasesRelation.Generate)
            {
                if (tiYong.Start == InternalTrigram.Attribute)
                {
                    return InternalExternalRelation.InternalGeneratesExternal;
                }
                return InternalExternalRelation.ExternalGeneratesInternal;
            }

            if (tiYong.Relation == FivePhasesRelation.OverCome)
            {
                if (tiYong.Start == InternalTrigram.Attribute)
                {
                    return InternalExternalRelation.InternalOvercomesExternal;
                }
                return InternalExternalRelation.ExternalOvercomessInternal;
            }

            return InternalExternalRelation.InternalExternalSame;
        }

        public override string ToString()
        {
            return string.Format(CultureInfo.InvariantCulture,
                "{0}({1}{2}{3}{4}) {5}{6}{7}",
                Name, Upper.Name, Resources.Main.WordUp, Lower.Name, Resources.Main.WordDown,
                ChangingIndexName, Resources.Main.ChineseWordYao, Resources.Main.ChineseWordDong);
        }
    }
}
