package contentapi

import app.LifecycleComponent
import common._
import play.api.inject.ApplicationLifecycle

import scala.concurrent.{Future, ExecutionContext}

class SectionsLookUpLifecycle(
  appLifecycle: ApplicationLifecycle,
  jobs: JobScheduler,
  akkaAsync: AkkaAsync
)(implicit ec: ExecutionContext) extends LifecycleComponent with Logging {

  appLifecycle.addStopHook { () => Future {
    descheduleJobs()
  }}

  private def scheduleJobs() {
    jobs.schedule("SectionsLookUpJob", "0 * * * * ?") {
      SectionsLookUp.refresh()
    }
  }

  private def descheduleJobs() {
    jobs.deschedule("SectionsLookUpJob")
  }

  override def start(): Unit = {
    descheduleJobs()
    scheduleJobs()

    akkaAsync.after1s {
      SectionsLookUp.refresh()
    }
  }
}
