import { CopyToClipboard } from "react-copy-to-clipboard";
import { RedditShareButton, TwitterShareButton, FacebookShareButton } from "react-share";
export default function Share({ liked, inline, url, desc, title, tags, onCopy, likeCallback, tipPlacement = ["bottom", "bottom", "bottom", "bottom", "bottom"] }) {
	return (
		<div className={inline ? "d-flex flex-row" : "d-flex flex-column"}>
			<div className='stats-item hover-effect pointer-cursor'>
				<span className='icon-spacer-margin ripple pointer-cursor' onClick={() => likeCallback()} data-tip={liked ? "Unlike the post" : "Like the post"} data-place={tipPlacement[0]}>
					{liked ? <i className='fas fa-heart fa-xs'></i> : <i className='far fa-heart fa-xs'></i>} {liked ? "Liked" : "Like"}
				</span>
			</div>
			<CopyToClipboard text={url} onCopy={() => onCopy("Post url copied to clipboard")} data-tip='Copy post url to clipboard' data-place={tipPlacement[1]}>
				<div className='stats-item hover-effect pointer-cursor'>
					<span className='icon-spacer-margin pointer-cursor'>
						<i className='fas fa-link fa-xs'></i> Copy Link
					</span>
				</div>
			</CopyToClipboard>

			{inline ? (
				<>
					<RedditShareButton url={url} title={title} className='hover-effect'>
						<span className='icon-spacer-margin inline pointer-cursor' data-tip='Share the post to reddit' data-place={tipPlacement[2]}>
							<i className='fab fa-reddit fa-xs'></i>
						</span>
					</RedditShareButton>
					<TwitterShareButton url={url} title={title} hashtags={tags} className='hover-effect'>
						<span className='icon-spacer-margin inline pointer-cursor' data-tip='Share the post to twitter' data-place={tipPlacement[3]}>
							<i className='fab fa-twitter fa-xs'></i>
						</span>
					</TwitterShareButton>
					<FacebookShareButton url={url} quote={desc} className='hover-effect'>
						<span className='icon-spacer-margin inline pointer-cursor ' data-tip='Share the post to facebook' data-place={tipPlacement[4]}>
							<i className='fab fa-facebook-f fa-xs'></i>
						</span>
					</FacebookShareButton>
				</>
			) : (
				<div className='stats-item'>
					<RedditShareButton url={url} title={title} className='hover-effect'>
						<span className='icon-spacer-margin inline pointer-cursor' data-tip='Share the post to reddit' data-place={tipPlacement[2]}>
							<i className='fab fa-reddit fa-xs'></i>
						</span>
					</RedditShareButton>
					<TwitterShareButton url={url} title={title} hashtags={tags} className='hover-effect'>
						<span className='icon-spacer-margin inline pointer-cursor' data-tip='Share the post to twitter' data-place={tipPlacement[3]}>
							<i className='fab fa-twitter fa-xs'></i>
						</span>
					</TwitterShareButton>
					<FacebookShareButton url={url} quote={desc} className='hover-effect'>
						<span className='icon-spacer-margin inline pointer-cursor ' data-tip='Share the post to facebook' data-place={tipPlacement[4]}>
							<i className='fab fa-facebook-f fa-xs'></i>
						</span>
					</FacebookShareButton>
				</div>
			)}
		</div>
	);
}
