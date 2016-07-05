package test

import controllers.HealthCheck
import org.scalatest.{Suites, Tag}

object ArticleComponents extends Tag("article components")

class ArticleTestSuite extends Suites (
  new AnalyticsFeatureTest,
  new ArticleControllerTest,
  new ArticleMetaDataTest,
  new ArticleFeatureTest,
  new CdnHealthCheckTest,
  new SectionsNavigationFeatureTest,
  new MembershipAccessTest,
  new PublicationControllerTest
) with SingleServerSuite {

  override lazy val port: Int = new HealthCheck().testPort
}
