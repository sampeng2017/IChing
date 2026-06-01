namespace SamPeng.IChing.BaGua
{
    class FivePhasesPairs
    {
        public FivePhasesPairs(FivePhasesAttribute start, FivePhasesAttribute end, FivePhasesRelation relation)
        {
            Start = start;
            End = end;
            Relation = relation;
        }

        public FivePhasesAttribute End { get; private set; }
        public FivePhasesRelation Relation { get; private set; }
        public FivePhasesAttribute Start { get; private set; }
    }
}
