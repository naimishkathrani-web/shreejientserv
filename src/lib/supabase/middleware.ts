import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    // Protected Routes Logic
    const url = request.nextUrl.clone()
    const path = url.pathname

    // 1. Admin Routes
    if (path.startsWith('/admin')) {
        if (path === '/admin/login') {
            // If already logged in as admin, redirect to dashboard
            if (user?.user_metadata?.role === 'admin') {
                url.pathname = '/admin/dashboard'
                return NextResponse.redirect(url)
            }
            return response
        }

        // For all other admin routes, require admin role
        if (!user || user.user_metadata?.role !== 'admin') {
            url.pathname = '/admin/login'
            return NextResponse.redirect(url)
        }
    }

    // 2. Rider Routes
    if (path.startsWith('/rider')) {
        if (path === '/rider/login' || path === '/rider/register') {
            // If already logged in as rider, redirect to dashboard
            if (user?.user_metadata?.role === 'rider') {
                url.pathname = '/rider/dashboard'
                return NextResponse.redirect(url)
            }
            return response
        }

        // For all other rider routes, require rider role
        if (!user || user.user_metadata?.role !== 'rider') {
            url.pathname = '/rider/login'
            return NextResponse.redirect(url)
        }
    }

    // 3. Agency Routes
    if (path.startsWith('/agency')) {
        if (path === '/agency/login' || path === '/agency/register') {
            // If already logged in as agency, redirect to dashboard
            if (user?.user_metadata?.role === 'agency') {
                url.pathname = '/agency/dashboard'
                return NextResponse.redirect(url)
            }
            return response
        }

        // For all other agency routes, require agency role
        if (!user || user.user_metadata?.role !== 'agency') {
            url.pathname = '/agency/login'
            return NextResponse.redirect(url)
        }
    }

    return response
}
