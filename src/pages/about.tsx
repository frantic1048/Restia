import Layout from '@components/Layout'
import { shuffle } from '@util/util'
import friends from '@constants/friends'
import { url } from 'csx'
import * as React from 'react'
import { classes, style } from 'typestyle'
import { PageProps } from 'gatsby'

const friendsListClassName = style({
    listStyle: 'none',
})
const avatarClassName = style({
    position: 'relative',
    float: 'left',
    clear: 'left',
    width: '60px',
    height: '60px',
    marginRight: '1em',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundColor: 'white',
    border: '2px solid white',
    borderRadius: '50px',
})
const makeAvatarImageClassName = (githubId: string) =>
    style({
        backgroundImage: url(`https://avatars.githubusercontent.com/${githubId}?v=3&amp;s=60`),
    })

/**
 * FIXME: broken links and outdated infos in friends list
 */
const enableFriendsList = false

const friendsList = (
    <ul className={friendsListClassName}>
        {shuffle(friends).map(([nick, githubId, link, descriptionHtml]) => (
            <li key={githubId}>
                <figure>
                    <div className={classes(avatarClassName, makeAvatarImageClassName(githubId))} />
                    <figcaption>
                        <a href={link} target="_blank" rel="noopener noreferrer">
                            {nick}
                        </a>
                    </figcaption>
                    {/** TODO: legacy implementation form old logdown site, could use safer rendering */}
                    {/* eslint-disable-next-line @typescript-eslint/naming-convention */}
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
        <p>发现过去记录的不少链接坏掉了或者信息需要更新，待整理。 ˊ_&gt;ˋ</p>
        {enableFriendsList && friendsList}
    </Layout>
)
