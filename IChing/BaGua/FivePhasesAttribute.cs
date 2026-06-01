

namespace SamPeng.IChing.BaGua
{
    sealed class FivePhasesAttribute
    {
        public static FivePhasesAttribute Earth;
        public static FivePhasesAttribute Fire;
        public static FivePhasesAttribute Metal;
        public static FivePhasesAttribute Water;
        public static FivePhasesAttribute Wood;

        readonly string name;
        FivePhasesAttribute next;

        static FivePhasesAttribute()
        {
            Water = new FivePhasesAttribute(Resources.Main.FivePhasesAttributeWater, null);
            Metal = new FivePhasesAttribute(Resources.Main.FivePhasesAttributeGold, Water);
            Earth = new FivePhasesAttribute(Resources.Main.FivePhasesAttributeEarth, Metal);
            Fire = new FivePhasesAttribute(Resources.Main.FivePhasesAttributeFire, Earth);
            Wood = new FivePhasesAttribute(Resources.Main.FivePhasesAttributeWood, Fire);
            Water.next = Wood;
        }

        FivePhasesAttribute(string name, FivePhasesAttribute next)
        {
            this.name = name;
            this.next = next;
        }

        public FivePhasesAttribute Generates
        {
            get
            {
                return this.next;
            }
        }

        public string Name { get { return this.name; } }
        public FivePhasesAttribute Overcomes
        {
            get
            {
                return this.next.next;
            }
        }

        static FivePhasesPairs GetRelation(FivePhasesAttribute e1, FivePhasesAttribute e2)
        {
            if (e1 == e2)
                return new FivePhasesPairs(e1, e2, FivePhasesRelation.Same);
            if (e1.Generates == e2)
                return new FivePhasesPairs(e1, e2, FivePhasesRelation.Generate);
            if (e1.Overcomes == e2)
                return new FivePhasesPairs(e1, e2, FivePhasesRelation.OverCome);
            if (e2.Generates == e1)
                return new FivePhasesPairs(e2, e1, FivePhasesRelation.Generate);
            return new FivePhasesPairs(e2, e1, FivePhasesRelation.OverCome);
        }

        public FivePhasesPairs GetRelation(FivePhasesAttribute another)
        {
            return GetRelation(this, another);
        }

        public override string ToString()
        {
            return Name;
        }
    }
}
