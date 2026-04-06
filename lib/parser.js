const extractUniversalData = (html) => {
    const startMarker = '<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application/json">';
    const endMarker = '</script>';

    const startIndex = html.indexOf(startMarker);
    if (startIndex === -1) return null;

    const endIndex = html.indexOf(endMarker, startIndex);
    if (endIndex === -1) return null;

    try {
        const jsonStr = html.substring(startIndex + startMarker.length, endIndex).trim();
        return JSON.parse(jsonStr);
    } catch (e) {
        console.error("JSON Parse Error:", e.message);
        return null;
    }
};

const parseUserData = (data_all) => {
    const base = data_all?.__DEFAULT_SCOPE__?.["webapp.user-detail"] || {};
    const user = base?.userInfo?.user || {};
    const stats = base?.userInfo?.stats || {};
    const itemList = base?.itemList || [];

    
    let lastPostDate = "N/A";
    let lastVideoLink = "N/A";

    if (itemList.length > 0) {
        const lastVideo = itemList[0];
        const createTime = lastVideo.createTime;
        if (createTime) {
            lastPostDate = new Date(createTime * 1000).toLocaleString('id-ID');
        }
        lastVideoLink = `https://www.tiktok.com/@${user.uniqueId}/video/${lastVideo.id}`;
    }

    
    let createDate = "N/A";
    if (user.id) {
        try {
            const timestamp = BigInt(user.id) >> BigInt(32);
            createDate = new Date(Number(timestamp) * 1000).toLocaleString('id-ID');
        } catch (e) {}
    }

    return {
        Name: user.nickname || "N/A",
        DisplayName: `@${user.uniqueId || "N/A"}`,
        AccountID: user.id || "N/A",
        FollowersCount: stats.followerCount || 0,
        FollowingCount: stats.followingCount || 0,
        FriendCount: stats.friendCount || 0,
        AllLikeCount: stats.heartCount || 0,
        Country: user.region || "N/A",
        ProfileCaptureUrl: user.avatarLarger || user.avatarMedium || "N/A",
        LastVideoPost: lastPostDate,
        LastVideoLink: lastVideoLink,
        TotalPost: stats.videoCount || 0,
        ItsVerified: user.verified || false,
        StatusAccount: user.privateAccount ? "Private" : "Public",
        Bio: user.signature || "No Bio",
        CreateDate: createDate,
        scrapedAt: new Date().toISOString()
    };
};

module.exports = { extractUniversalData, parseUserData };
