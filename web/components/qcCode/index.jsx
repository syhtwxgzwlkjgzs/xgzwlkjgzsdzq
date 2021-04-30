import React from 'react';
import style from './index.module.scss';

const Index = ({ 
  src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAABGCAYAAABxLuKEAAAFSElEQVR4Xu1c0XLbMAxL0uv/f3AvzU7p6DEwQFDOQ2+J9tZWliWQBEFK3vl0Ot1OzX+3Gx96Pp/pDDE+/j5+/v7+Pn18fOzG57nz+Dwwnr1cLqfr9bqbYzzH3jkGqjWqrY8d3dSG80PupThHXgguNubNG2TjB4ADAAQznkMAqzXGXM4HYs4FDCBFgWHulq1duan6m7MQeuX4OeZCK2Mo4XrHc+x3Y07lffF+XP+Dxyxg/nHRU8BktCtyy9YY/PD19bUjYGZt5KIZj0HO+xWPYeGivG9s7vPzc5dVMnHifIp8Y5zKYnmeBYwgtaeAqYiySoUzBDvGMi3DQmmk6rGhSrdksq687lfS9csC093YbLpmAiyTLwo8nB89RpFvV1J093lXyi3ZK2bsymzMEEzas1AN4LrKd2bjbuwCRhk9ewxLex19UqlXVsApT1D1FpJveBCr8dR6Iyydp2xhuYB5hGoDRrUdOtaoWgUsdYY1Wfpl4532QOtXtZJ6t/Kwe0nA3GsBk/oxmWNmeh1K/LE5shGUcIsxKht1OEb1mFyjbGs7sHTNmkaOYLFuqbzQLQ6BQbKuGlWOXHEuqc0WMD9MsvPuAUyn4VNZosNHnRBSTSZ8dxVKap0V8TNJcRd4C5h9s/whK3Wa4oprqu6fi3vFT7GemX6M6s2gxyiv28g3p2sXEgo4RtZKx3SOPhCorlKmXAFHO26uBQycb+2a4Ypj0GqVymWWYoQ25sitzRwibH5V37jG1Xg3blSFsxonyXcBY7ISawIx0DoN6S4Jxzh1rhR/V9U485iZCv3u7S5dvy0w+ey6qpVYmmaW68yhSgL0KJVBcFyXT8Zzrj57Kit1wkalcKWAWSGqTgmcBsnvUKA5ArcCr9pgJQhfAhhVYao0zEi006aI57oh0iVr5hVOxaPX7davOKZK128DDJLojMSP1KhahIpQ8fdHaq2qEYYeo9qksszp3qiqwqoLiioKlWFQ+R4JQQyzqazk4tGF1UsCwwReJ90pLcH0ztGUiWQdP3d0UKWK2f7Q+FT5LmCKkqBKlVXHz501zajPI9dAFF91+zCb57hzpU62mMlimfwwJLoh1zk+6QKkQs4euL0tMOr4hKlh1091hKz6rsq6Lr139BeSqjpXouTLxNbbA+O+JWD9mCq8mFfl8TPNcEzPnVNEpYbdNZBdz3cB8wM/BaYjhpg6Zk0pjHsm+Jy0R25xqZa9A+lB3edTnYUHgefamJ0eK5IYLlDdDGeiUl1BrdK8LAr/ni+1a6VcEixg0rcErhnOQqOjbZhyHs9VHoPWxtud7jrreCdT5eP36sRBCrwFzOOFsrIZzhrTzAOqliIrE1T6DUvjfEcuQKsaT9VdqmUi7/kql2TuqhbDGD8Tp7sZroiyQ75KzzylfKtYfRtg2DWQI6FU6ZzsUaq6Hs+jld2nf6yUUd7LZIP6Evdu/AXMI2Qb+R75yEJV2TNhNsYihziPQfI+otg7327f97GAER7jikgm1avWZhaELDM4SV7VVspjVAdxjA+vwnMlvCu846vuuVJFyJk4KyDHOPWxKAOke6wTz3YUuUr1OMdTX+oz73hJYFwDSpFddTKQCRk9xllPEWXnXMmlbUf8hz5IR7dbwMB/k9JN27k0yNW1s5q7g5dDWfGMaqird2/zsGsgiidY0ZiZXynR7FGKfBm5q03he1wfKa9RhSfSyKFQqgpMl13+S2AqwsoWZW7bUaGodrvfLaF+qTxG7WH6OusRHfM2wLjUxkgO07Bq+OT4jtZmVLUu7c42qlgY49qdRKAdPAdQpWNeDZg/VZWoZ246hiMAAAAASUVORK5CYII=', 
  title = 'Discuz! Q',
  subTitle = '扫一扫访问移动端'
}) => {
  return (
    <div className={style.code}>
      <div className={style.codeBox}>
        <img className={style.codeBoxImg} src={src} alt=""/>
      </div>
      <div className={style.codeText}>
        <p className={style.codeTextVisit}>{subTitle}</p>
        <p className={style.codeTextLogo}>{ title }</p>
      </div>
    </div>
  )
}
export default React.memo(Index)