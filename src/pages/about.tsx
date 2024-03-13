import { calc, em, px, quote, url } from 'csx'
import { PageProps } from 'gatsby'
import * as React from 'react'
import { classes, style } from 'typestyle'

import Layout from '../components/Layout'
import friends from '../constants/friends'
import { largeMedia, scaleAt, smallMedia } from '../util/constants'

const friendsListClassName = style(
    {
        listStyle: 'none',
        display: 'grid',
        gridAutoFlow: 'dense',
        gridTemplateColumns: 'repeat(3, 1fr)',
        padding: 0,
        rowGap: px(10),
        columnGap: px(10),
    },
    smallMedia({ gridTemplateColumns: `repeat(1, 1fr)` }),
    largeMedia({ gridTemplateColumns: `repeat(2, 1fr)` }),
)
const friendEntryClassName = style({
    margin: 0,
    $nest: {
        '&>p': { margin: 0 },
    },
})
const friendCaptionClassName = style(
    {
        textAlign: 'left',
        $nest: {
            '&>a': {
                display: 'inline-block',
                // avatar size 60px
                // avatar margin 1em
                // avatar border 2 * 5px
                width: `calc(100% - 60px - 1em - 10px)`,
            },
        },
    },
    ...scaleAt(1),
)
const avatarClassName = style({
    position: 'relative',
    width: '60px',
    height: '60px',
    float: 'left',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundColor: 'white',
    border: '2px solid white',
    borderRadius: px(5),
    marginRight: em(1),
})
const makeAvatarImageClassName = (githubId: string) =>
    style({
        backgroundImage: url(`https://avatars.githubusercontent.com/${githubId}?v=4&s=256`),
    })
const makeGithubLink = (githubId: string) => `https://github.com/${githubId}`

const friendsList = (
    <ul className={friendsListClassName}>
        {friends.map(([nick, githubId, link, descriptionHtml, metOffline]) => (
            <li key={githubId}>
                <figure className={friendEntryClassName}>
                    <div className={classes(avatarClassName, makeAvatarImageClassName(githubId))} />
                    <figcaption className={friendCaptionClassName}>
                        <a href={link ?? makeGithubLink(githubId)} target="_blank" rel="noopener noreferrer">
                            {nick}
                        </a>
                    </figcaption>
                    {/** TODO: legacy implementation form old logdown site, could use safer rendering */}
                    {}
                    <p dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
                </figure>
            </li>
        ))}
    </ul>
)

export default ({}: PageProps) => (
    <Layout pageTitle="Pyon Pyon About" pageUrl="/about" pageDescription="about">
        <h1>Site</h1>
        <p>
            一直没糊 About，然后某天有小伙伴惊讶我博客原来搬家了（之前在{' '}
            <a href="http://frantic1048.logdown.com">http://frantic1048.logdown.com</a>
            ），嗨呀，还是先简单写一个在这儿吧，毕竟
            <a href="http://disq.us/p/1p1f59o">三年前就有小伙伴吐槽</a>我的托管博客怎么还没上 HTTPS，在 2020
            总算是实现了。也终于算是换到了自己最初想要的自己糊界面的实现方式（
            <a href="https://www.gatsbyjs.org/">Gatsby</a>
            刚好帮我解决了不想操心的数据加载部分的问题），一番折腾也能终于比较科学地贴图了，只不过样式上还没想好糊个什么样，总之一步一步来吧。
        </p>
        <h1>Author</h1>
        <p>
            <code>frantic1048</code> 是平常用的 codename，微微有点宅，以及，使用{' '}
            <a href="https://www.archlinux.org/">Arch Linux</a>。
        </p>
        <h1>Friends</h1>
        <p>线上线下遇到的小伙伴们：</p>
        {friendsList}
    </Layout>
)
