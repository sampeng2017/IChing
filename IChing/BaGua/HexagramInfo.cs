
using System.Collections.Generic;

namespace SamPeng.IChing.BaGua
{
    public static class HexagramInfo
    {
        //{"乾为天", "天泽履", "天火同人", "天雷无妄", "天风姤","天水讼", "天山遁", "天地否"},
        //{"泽天夬", "兑为泽", "泽火革", "泽雷随", "泽风大过","泽水困", "泽山咸", "泽地萃"},
        //{"火天大有", "火泽睽", "离为火", "火雷噬嗑", "火风鼎","火水未济", "火山旅", "火地晋"},
        //{"雷天大壮", "雷泽归妹", "雷火丰", "震为雷", "雷风恒","雷水解", "雷山小过", "雷地豫"},
        //{"风天小畜", "风泽中孚", "风火家人", "风雷益", "巽为风","风水涣", "风山渐", "风地观"},
        //{"水天需", "水泽节", "水火既济", "水雷屯", "水风井","坎为水", "水山蹇", "水地比"},
        //{"山天大畜", "山泽损", "山火贲", "山雷颐", "山风蛊","山水蒙", "艮为山", "山地剥"},
        //{"地天泰", "地泽临", "地火明夷", "地雷复", "地风升","地水师", "地山谦", "坤为地"},
        public static readonly string[,] Hexagrams = new string[,] { 
            {
                Resources.Main.HexagramQian, 
                Resources.Main.HexagramLv, 
                Resources.Main.HexagramTongRen, 
                Resources.Main.HexagramWuWang, 
                Resources.Main.HexagramGou,
                Resources.Main.HexagramSong, 
                Resources.Main.HexagramDun, 
                Resources.Main.HexagramPi
            },

            {
                Resources.Main.HexagramGuai,
                Resources.Main.HexagramDui,
                Resources.Main.HexagramGe,
                Resources.Main.HexagramSui,
                Resources.Main.HexagramDaGuo,
                Resources.Main.HexagramKun,
                Resources.Main.HexagramXian,
                Resources.Main.HexagramCui
            },

            {
                Resources.Main.HexagramDaYou, 
                Resources.Main.HexagramKui, 
                Resources.Main.HexagramLi, 
                Resources.Main.HexagramShiKe, 
                Resources.Main.HexagramDing,
                Resources.Main.HexagramWeiJi, 
                Resources.Main.HexagramLv_Travel, 
                Resources.Main.HexagramJin
            },
            
            {
                Resources.Main.HexagramDaZhuang, 
                Resources.Main.HexagramGuiMei, 
                Resources.Main.HexagramFeng, 
                Resources.Main.HexagramZhen, 
                Resources.Main.HexagramHeng,
                Resources.Main.HexagramJie, 
                Resources.Main.HexagramXiaoGuo, 
                Resources.Main.HexagramYu
            },

            {
                Resources.Main.HexagramXiaoXu, 
                Resources.Main.HexagramZhongFu, 
                Resources.Main.HexagramJiaRen, 
                Resources.Main.HexagramYi, 
                Resources.Main.HexagramXun,
                Resources.Main.HexagramHuan, 
                Resources.Main.HexagramJian, 
                Resources.Main.HexagramGuan
            },
            
            {
                Resources.Main.HexagramXu, 
                Resources.Main.HexagramJie_ShuiZe, 
                Resources.Main.HexagramJiJi, 
                Resources.Main.HexagramTun, 
                Resources.Main.HexagramJing,
                Resources.Main.HexagramKan, 
                Resources.Main.HexagramJian_ShuiShan, 
                Resources.Main.HexagramBi
            },

            {
                Resources.Main.HexagramDaXu, 
                Resources.Main.HexagramSun, 
                Resources.Main.HexagramBi_ShanHuo, 
                Resources.Main.HexagramYi_ShanLei, 
                Resources.Main.HexagramGu,
                Resources.Main.HexagramMeng, 
                Resources.Main.HexagramGen, 
                Resources.Main.HexagramBo
            },
            
            {
                Resources.Main.HexagramTai, 
                Resources.Main.HexagramLin, 
                Resources.Main.HexagramMingYi, 
                Resources.Main.HexagramFu, 
                Resources.Main.HexagramSheng,
                Resources.Main.HexagramShi, 
                Resources.Main.HexagramQian_DiShan, 
                Resources.Main.HexagramKun_WeiDi
            },
        };

        static readonly Dictionary<string, IList<string>> HexagramExplanations = new Dictionary<string, IList<string>>();
        //public static IList<string> GetHexagramExplanation(string hexagram)
        //{
        //    if (HexagramExplanations.ContainsKey(hexagram))
        //    {
        //        return HexagramExplanations[hexagram];
        //    }

        //    using (var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream("ShengPeng.GuaGenerator.Hexagrams.txt"))
        //    using (StreamReader sr = new StreamReader(stream))
        //    {
        //        string currentLine = string.Empty;
        //        string currentGraphName = string.Empty;
        //        string lineToStopRead = "===" + hexagram + "===";
        //        while (!lineToStopRead.Equals(currentLine))
        //        {
        //            currentLine = sr.ReadLine();
        //            if (currentLine.StartsWith("+++"))
        //            {
        //                currentGraphName = currentLine.Substring(3, currentLine.Length - 6);
        //                if (HexagramExplanations.ContainsKey(currentGraphName))
        //                {
        //                    continue;
        //                }

        //                var tmpList = new List<string>();
        //                while (!currentLine.StartsWith("==="))
        //                {
        //                    currentLine = sr.ReadLine();
        //                    tmpList.Add(currentLine);
        //                }
        //                HexagramExplanations.Add(currentGraphName, tmpList.ToArray());
        //            }
        //        }
        //    }

        //    return HexagramExplanations[hexagram];
        //}
    }
}
