import { supabase } from './supabase'

const CONFIG_ID = 'main'

export async function savePageData(data: any): Promise<void> {
  const { error } = await supabase
    .from('page_config')
    .upsert({ id: CONFIG_ID, data, updated_at: new Date().toISOString() })

  if (error) throw error
}

export async function loadPageData(): Promise<any> {
  // index.html fires this fetch the instant the browser sees it, in parallel with the JS
  // bundle downloading, so by the time we get here it's often already resolved or close to it.
  const prefetch = (window as any).__pageDataPromise
  if (prefetch) {
    const rows = await prefetch
    if (Array.isArray(rows) && rows[0]?.data) return rows[0].data
  }

  const { data, error } = await supabase
    .from('page_config')
    .select('data')
    .eq('id', CONFIG_ID)
    .single()

  if (error || !data) return null
  return data.data
}
