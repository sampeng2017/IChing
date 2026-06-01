using System;
using System.Globalization;
using System.Windows;
using System.Windows.Media.Imaging;
using System.Windows.Threading;
using Microsoft.Phone.Controls;
using SamPeng.IChing;
using SamPeng.IChing.BaGua;
using SamPeng.IChing.ChineseCalendar;

namespace IChing
{
    public partial class MainPage : PhoneApplicationPage
    {
        BitmapImage appImage;        
        ChineseCalendarDate currentDate;
        Hexagram currentGua;
        DispatcherTimer dispatcherTimer;

        public MainPage()
        {
            InitializeComponent();
            appImage = new BitmapImage(new Uri("ApplicationIcon.png", UriKind.RelativeOrAbsolute));
            currentDate = new ChineseCalendarDate(DateTime.Now);
            InitLables();
        }

        private void OnBtnAboutClick(object sender, RoutedEventArgs e)
        {
            DisplayHelp();
        }

        void OnBtnDivineRandClick(object sender, RoutedEventArgs e)
        {
            this.currentGua = Divination.Divine();
            this.rbMain.Focus();
            this.rbMain.IsChecked = true;
            DisplayContent();
        }

        void OnBtnDevineNowClick(object sender, RoutedEventArgs e)
        {
            this.currentGua = Divination.DivineNow();
            this.rbMain.Focus();
            this.rbMain.IsChecked = true;
            DisplayContent();
        }

        void EnableAllRadioButtons(bool yesNo)
        {
            this.rbMain.IsEnabled = this.rbJudge.IsEnabled = this.rbJudgeClassfied.IsEnabled = this.rbMeihua.IsEnabled = this.rbPoems.IsEnabled = this.rbSymbols.IsEnabled = yesNo;
        }

        void DisplayContent()
        {
            if (this.currentGua == null)
            {
                return;
            }
            scv.ScrollToVerticalOffset(180);
            EnableAllRadioButtons(true);

            this.tblTitle.Text = currentGua.ToString();

            this.image1.Source = currentGua.GetImage();

            if (this.rbMain.IsChecked.HasValue && this.rbMain.IsChecked.Value)
            {
                this.tbxContent.Text = currentGua.GetMainDesc() + Environment.NewLine + Environment.NewLine +
                    currentGua.GetChangeDesc();
            }
            else if (this.rbSymbols.IsChecked.HasValue && this.rbSymbols.IsChecked.Value)
            {
                this.tbxContent.Text = currentGua.GetSymbolDesc();
            }
            else if (this.rbPoems.IsChecked.HasValue && this.rbPoems.IsChecked.Value)
            {
                this.tbxContent.Text = currentGua.GetPoemsDesc();
            }
            else if (this.rbJudge.IsChecked.HasValue && this.rbJudge.IsChecked.Value)
            {
                this.tbxContent.Text = currentGua.GetJudgementDesc();
            }
            else if (this.rbJudgeClassfied.IsChecked.HasValue && this.rbJudgeClassfied.IsChecked.Value)
            {
                this.tbxContent.Text = currentGua.GetJudgementClassifiedDesc();
            }
            else if (this.rbMeihua.IsChecked.HasValue && this.rbMeihua.IsChecked.Value)
            {
                this.tbxContent.Text = currentGua.GetMeiHuaYiShu();
            }
        }

        void DisplayHelp()
        {
            this.currentGua = null;
            this.tbxContent.Text = SamPeng.IChing.Resources.Main.MainHelp;

            this.tblTitle.Text = string.Format(CultureInfo.InvariantCulture,
                "{0}《{1}》", SamPeng.IChing.Resources.Main.ChineseAbout, SamPeng.IChing.Resources.Main.MainPageTitle);

            EnableAllRadioButtons(false);

            this.image1.Source = appImage;
            scv.ScrollToVerticalOffset(180);
        }

        private void IChingPage_Loaded(object sender, RoutedEventArgs e)
        {
            dispatcherTimer = new DispatcherTimer()
            {
                Interval = TimeSpan.FromSeconds(10)
            };
            dispatcherTimer.Tick += OnDispatcherTimerTick;
            DisplayHelp();

            dispatcherTimer.Start();
        }

        void InitLables()
        {
            this.ApplicationTitle.Text = SamPeng.IChing.Resources.Main.MainPageTitle;
            this.CurrentDate.Text = currentDate.ToString();
            this.btnDivineNow.Content = SamPeng.IChing.Resources.Main.DivineNow;
            this.btnDivineRand.Content = SamPeng.IChing.Resources.Main.DivineRandom;
            this.btnAbout.Content = SamPeng.IChing.Resources.Main.ChineseAbout;

            this.rbMain.Content = SamPeng.IChing.Resources.Main.HexgramMain;
            this.rbSymbols.Content = SamPeng.IChing.Resources.Main.HexgramSymbol;
            this.rbPoems.Content = SamPeng.IChing.Resources.Main.HexgramPoem;
            this.rbJudge.Content = SamPeng.IChing.Resources.Main.HexgramJudgement;
            this.rbJudgeClassfied.Content = SamPeng.IChing.Resources.Main.HexgramJudgeClassfied;
            this.rbMeihua.Content = SamPeng.IChing.Resources.Main.HexGramMeihua;
        }

        void OnDispatcherTimerTick(object sender, EventArgs e)
        {
            var tmpDate = new ChineseCalendarDate(DateTime.Now);
            if (currentDate.ChineseTwoHourPeriod == tmpDate.ChineseTwoHourPeriod)
            {
                return;
            }
            currentDate = tmpDate;
            Dispatcher.BeginInvoke(() =>
                {
                    this.CurrentDate.Text = currentDate.ToString();
                });
        }

        private void rbMain_Checked(object sender, RoutedEventArgs e)
        {
            DisplayContent();
        }

        private void IChingPage_Unloaded(object sender, RoutedEventArgs e)
        {
            this.dispatcherTimer.Stop();
        }
    }
}