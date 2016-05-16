package conf.switches

import org.joda.time.LocalDate

trait ABTestSwitches {

  // Owner: Dotcom Reach
  val ABFrontsOnArticles2 = Switch(
    SwitchGroup.ABTests,
    "ab-fronts-on-articles2",
    "Injects fronts on articles for the test",
    safeState = Off,
    sellByDate = new LocalDate(2016, 7, 5),
    exposeClientSide = true
  )

  val ABLiveBlogChromeNotificationsInternal = Switch(
    SwitchGroup.ABTests,
    "ab-live-blog-chrome-notifications-internal",
    "Live blog chrome notifications - Internal",
    safeState = Off,
    sellByDate = new LocalDate(2016, 6, 1),
    exposeClientSide = true
  )

  val ABLiveBlogChromeNotificationsProd = Switch(
    SwitchGroup.ABTests,
    "ab-live-blog-chrome-notifications-prod",
    "Live blog chrome notifications - prod",
    safeState = Off,
    sellByDate = new LocalDate(2016, 6, 1),
    exposeClientSide = true
  )

  val ABLoyalAdblockingSurvey = Switch(
    SwitchGroup.ABTests,
    "ab-loyal-adblocking-survey",
    "An adblock ongoing survey for all loyal users",
    safeState = Off,
    sellByDate = new LocalDate(2016, 5, 31),
    exposeClientSide = true
  )

  val ABParticipationStarRatings = Switch(
    SwitchGroup.ABTests,
    "ab-participation-star-ratings",
    "AB test switch to insert star ratings into film articles",
    safeState = Off,
    sellByDate = new LocalDate(2016, 6, 13),
    exposeClientSide = true
  )

  val ABParticipationLowFricMusic = Switch(
    SwitchGroup.ABTests,
    "ab-participation-low-fric-music",
    "AB test switch to insert low friction participation into music",
    safeState = Off,
    sellByDate = new LocalDate(2016, 6, 15),
    exposeClientSide = true
  )

  val ABParticipationLowFricTv = Switch(
    SwitchGroup.ABTests,
    "ab-participation-low-fric-tv",
    "AB test switch to insert low friction participation into tv",
    safeState = Off,
    sellByDate = new LocalDate(2016, 6, 15),
    exposeClientSide = true
  )

  val ABParticipationLowFricRecipes = Switch(
    SwitchGroup.ABTests,
    "ab-participation-low-fric-recipes",
    "AB test switch to insert low friction participation into recipes",
    safeState = Off,
    sellByDate = new LocalDate(2016, 6, 15),
    exposeClientSide = true
  )

  val ABParticipationLowFricFashion = Switch(
    SwitchGroup.ABTests,
    "ab-participation-low-fric-fashion",
    "AB test switch to insert low friction participation into fashion",
    safeState = Off,
    sellByDate = new LocalDate(2016, 6, 15),
    exposeClientSide = true
  )

  val ABCleverFriend = Switch(
    SwitchGroup.ABTests,
    "ab-clever-friend-brexit",
    "Switch to trigger segmentation for clever friend exposure",
    safeState = Off,
    sellByDate = new LocalDate(2016, 7, 29),
    exposeClientSide = true
  )

  val ABWelcomeHeader = Switch(
    SwitchGroup.ABTests,
    "ab-welcome-header",
    "Welcome header for first time users test",
    safeState = Off,
    sellByDate = new LocalDate(2016, 5, 19),
    exposeClientSide = true
  )

  val ABHideEvenComments = Switch (
    SwitchGroup.ABTests,
    "ab-hide-even-comments",
    "Hides all comments on articles with an even web-publication-date",
     safeState = Off,
     sellByDate = new LocalDate(2015, 5, 31),
     exposeClientSide = true
  )
}
