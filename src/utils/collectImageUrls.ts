// Flattens every image URL referenced anywhere in pageData, grouped by priority, so the
// whole site's photos can be warmed in the browser cache after the home page's critical
// content has loaded.
//
// `home` is everything the home page itself shows (in scroll order); `detail` is only
// reachable by navigating into a service/subservice/course/trajectory page. usePrefetchImages
// warms `home` first and waits for it before starting `detail`, so a detail page's photos can
// never win the network race against a home section's own cover images.
export interface CollectedImageUrls {
  home: string[]
  detail: string[]
}

export function collectImageUrls(pageData: any): CollectedImageUrls {
  if (!pageData) return { home: [], detail: [] }
  const homeUrls: Array<string | undefined> = []
  const detailUrls: Array<string | undefined> = []

  // Home page, in scroll order.
  homeUrls.push(
    pageData.hero?.image, pageData.hero?.imageMobile,
    pageData.hero?.image2, pageData.hero?.image2Mobile,
    pageData.hero?.image3, pageData.hero?.image3Mobile,
    pageData.logo,
    pageData.about?.image,
  )
  pageData.services?.forEach((service: any) => homeUrls.push(service.image))
  pageData.courses?.forEach((course: any) => homeUrls.push(course.imageThumb || course.image))
  pageData.testimonials?.forEach((t: any) => homeUrls.push(t.photo))
  pageData.portfolio?.forEach((item: any) => homeUrls.push(item.image))
  homeUrls.push(pageData.location?.photo)

  // Only reachable by navigating into a service/subservice/course/trajectory page.
  pageData.services?.forEach((service: any) => {
    service.portfolioImages?.forEach((img: any) => detailUrls.push(img.image))
    service.subServices?.forEach((sub: any) => {
      detailUrls.push(sub.image)
      sub.portfolioImages?.forEach((img: any) => detailUrls.push(img.image))
    })
  })
  pageData.courses?.forEach((course: any) => {
    // The full-size cover is only otherwise needed on the course detail page.
    if (course.imageThumb) detailUrls.push(course.image)
    course.portfolioImages?.forEach((img: any) => detailUrls.push(img.image))
  })
  detailUrls.push(pageData.trajectoryCover)

  return {
    home: homeUrls.filter(Boolean) as string[],
    detail: detailUrls.filter(Boolean) as string[],
  }
}
