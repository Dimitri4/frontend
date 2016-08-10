package model

import conf.switches.Switches
import conf.{Configuration, Static}
import layout.FaciaContainer
import java.security.MessageDigest
import java.math.BigInteger
import scala.util.control.NonFatal


trait BaseBadge {
  def maybeThisBadge(tag: String): Option[Badge]
}

case class Badge(seriesTag: String, imageUrl: String, classModifier: Option[String] = None) extends BaseBadge {
  def maybeThisBadge(tag: String) = if (seriesTag == tag) Some(this) else None
}
case class SpecialBadge(hashedTag: String) extends BaseBadge {
  def maybeThisBadge(tag: String) = if (md5(salt + tag).contains(hashedTag)) {
    Some(Badge(tag, s"https://assets.guim.co.uk/special/$tag/special-badge.svg"))
  } else None

  private val salt = "a-public-salt3W#ywHav!p+?r+W2$E6="
    private val digest = MessageDigest.getInstance("MD5")

    private def md5(input: String): Option[String] = {
      try {
        digest.update(input.getBytes(), 0, input.length)

        Option(new BigInteger(1, digest.digest()).toString(16))
      } catch {
        case NonFatal(_) => None
      }
    }
}

object Badges {

  private val euSvg = Static("images/badges/eu-ref.svg")

  val usElection = Badge("us-news/us-elections-2016", Static("images/badges/us-election.png"), Some("us-election"))
  val ausElection = Badge("australia-news/australian-election-2016", Static("images/badges/aus-election.png"), Some("aus-election"))
  val voicesOfAmerica = Badge("us-news/series/voices-of-america", Static("images/badges/voices-of-america.svg"), Some("voices-of-america"))

  val euElection = Badge("politics/eu-referendum", euSvg)
  val euRealityCheck = Badge("politics/series/eu-referendum-reality-check", euSvg)
  val euBriefing = Badge("politics/series/eu-referendum-morning-briefing", euSvg)
  val euSparrow = Badge("politics/series/eu-referendum-live-with-andrew-sparrow", euSvg)

  val rio2016 = Badge("sport/rio-2016", Static("images/badges/rio-2016.svg"))

  val special = SpecialBadge("4dae5700e6b6fdf66d1567769b41c1c2")

  val allBadges = Seq(usElection, ausElection, voicesOfAmerica, special, rio2016, euElection, euRealityCheck, euBriefing, euSparrow)

  def badgeFor(c: ContentType) = {
    badgeForTags(c.tags.tags.map(_.id))
  }

  def badgeForTags(tags: Traversable[String]) = {

    val badgesForTags =
      for {
        tagId <- tags
        baseBadge <- allBadges
        maybeBadge <- baseBadge.maybeThisBadge(tagId)
      } yield maybeBadge
    badgesForTags.headOption
  }

  def badgeFor(fc: FaciaContainer) = badgeForTags(fc.href)

}
