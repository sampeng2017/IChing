
using System;
using System.Globalization;

namespace SamPeng.IChing.BaGua
{
    sealed class Trigram
    {
        public readonly static Trigram[] EightTrigrams;
        public static readonly Trigram Qian = new Trigram(1, FivePhasesAttribute.Metal);
        public static readonly Trigram Dui = new Trigram(2, FivePhasesAttribute.Metal);
        public static readonly Trigram Li = new Trigram(3, FivePhasesAttribute.Fire);
        public static readonly Trigram Zhen = new Trigram(4, FivePhasesAttribute.Wood);
        public static readonly Trigram Xun = new Trigram(5, FivePhasesAttribute.Wood);
        public static readonly Trigram Kan = new Trigram(6, FivePhasesAttribute.Water);
        public static readonly Trigram Gen = new Trigram(7, FivePhasesAttribute.Earth);
        public static readonly Trigram Kun = new Trigram(8, FivePhasesAttribute.Earth);

        readonly FivePhasesAttribute attribute;
        readonly int id;

        static Trigram()
        {
            EightTrigrams = new Trigram[] 
            {
                Qian, Dui, Li, Zhen, Xun, Kan, Gen, Kun
            };
        }

        Trigram(int id, FivePhasesAttribute attribute)
        {
            if (id < 1 || id > 8)
                throw new ArgumentException("guaId");
            this.id = id;
            this.attribute = attribute;
        }

        public FivePhasesAttribute Attribute { get { return this.attribute; } }
        public int Id { get { return this.id; } }
        public string Name { get { return TrigramInfo.Trigrams[id - 1]; } }
        public string Symbol { get { { return TrigramInfo.TrigramSymbols[id - 1]; } } }

        public Trigram Change(int yaoForChange)
        {
            if (yaoForChange < 1 || yaoForChange > 3)
            {
                throw new ArgumentException("yaoForChange");
            }
            int i = Id - 1;
            i = i ^ 7;
            int theXor;

            if (yaoForChange == 1)
            {
                theXor = 4;
            }
            else if (yaoForChange == 2)
            {
                theXor = 2;
            }
            else
            {
                theXor = 1;
            }

            int newI = (i ^ theXor) ^ 7;
            return EightTrigrams[newI];
        }

        public override string ToString()
        {
            return string.Format(CultureInfo.InvariantCulture,
                "{0}{1}{2}",
                Name, Resources.Main.ChineseWordRepresent, Symbol);
        }
    }
}
