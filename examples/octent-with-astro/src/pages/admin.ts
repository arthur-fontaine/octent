import { renderOctentAsString } from 'octent'

export async function get() {
  return new Response(
    renderOctentAsString({
      repositoryUrl: 'https://github.com/arthur-fontaine/myblog.git',
      contentDirectory: '/content',
      dataType: 'json',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    },
  )
}
