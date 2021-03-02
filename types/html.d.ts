import {HtmlExtension} from 'micromark/dist/shared-types'
import {FrontmatterOptions} from '.'

declare function html(options?: FrontmatterOptions | FrontmatterOptions[]): HtmlExtension
declare namespace html {}
export = html
