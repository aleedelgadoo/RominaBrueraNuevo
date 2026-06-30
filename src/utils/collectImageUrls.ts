// Flattens every image URL referenced anywhere in pageData, so the whole site's photos
// can be warmed in the browser cache after the home page's critical content has loaded.
export function collectImageUrls(pageData: any): string[] {
  if (!pageData) return []
  const urls: Array<string | undefined> = []

  urls.push(
    pageData.hero?.image, pageData.hero?.imageMobile,
    pageData.hero?.image2, pageData.hero?.image2Mobile,
    pageData.hero?.image3, pageData.hero?.image3Mobile,
    pageData.about?.image,
    pageData.logo,
    pageData.trajectoryCover,
    pageData.location?.photo,
  )

  pageData.portfolio?.forEach((item: any) => urls.push(item.image))
  pageData.testimonials?.forEach((t: any) => urls.push(t.photo))

  pageData.services?.forEach((service: any) => {
    urls.push(service.image)
    service.portfolioImages?.forEach((img: any) => urls.push(img.image))
    service.subServices?.forEach((sub: any) => {
      urls.push(sub.image)
      sub.portfolioImages?.forEach((img: any) => urls.push(img.image))
    })
  })

  pageData.courses?.forEach((course: any) => {
    urls.push(course.image)
    course.portfolioImages?.forEach((img: any) => urls.push(img.image))
  })

  return urls.filter(Boolean) as string[]
}
