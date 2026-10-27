# Cog-AI-Lab

Website tiếng Anh cho Cog-AI-Lab, dùng HTML, CSS và JavaScript thuần. Giao diện gồm **7 trang riêng** với nội dung ngắn gọn và cỡ chữ lớn. Font, logo và ảnh đều được lưu trong repository.

## Chạy website

```powershell
npm.cmd run dev
```

Mở **http://localhost:4173**. Dùng Node.js 22.12 trở lên; không cần cài thư viện để xem trang. Trên macOS/Linux dùng `npm run dev`.

Có thể mở trực tiếp `index.html` hoặc chạy `python -m http.server 8000` và mở http://localhost:8000.

## Cấu trúc trang

| Trang        | File                | Nội dung                                            |
| ------------ | ------------------- | --------------------------------------------------- |
| Home         | `index.html`        | Giới thiệu, hướng nghiên cứu, 2 tin mới nhất        |
| Members      | `members.html`      | Thành viên chia theo vai trò, ảnh và liên kết hồ sơ |
| Publications | `publications.html` | Tìm kiếm, lọc năm, thông tin bài báo                |
| Projects     | `projects.html`     | Dự án nghiên cứu và liên kết Paper/Code             |
| News         | `news.html`         | Tin tức, giải thưởng và hoạt động lab               |
| Conferences  | `conferences.html`  | Hội nghị có các công bố của nhóm                    |
| Contact      | `contact.html`      | Email và thông tin liên hệ                          |

Mỗi trang có URL riêng, có thể mở trực tiếp hoặc chia sẻ. Bộ lọc Publications được lưu trong URL, ví dụ `publications.html?q=CMTD&year=2026`.

## Thêm thành viên

Mở **`content.js`**, thêm một object vào mảng `members`:

```javascript
{
  name: 'Tên hiển thị',
  group: 'phd-students',
  role: 'PhD Student',
  title: 'PhD Student',
  affiliation: 'Tên trường hoặc tổ chức',
  image: 'member_pics/ten-thanh-vien.jpg',
  imagePosition: 'center',
  interests: ['Natural language processing', 'Empathetic AI'],
  homepage: null,
  scholar: null,
  email: null,
},
```

- Chép ảnh vào `member_pics/`; đặt **`image: null`** nếu chưa có ảnh. Hồ sơ sẽ hiển thị avatar mặc định màu xanh; ảnh tải lỗi cũng tự chuyển sang avatar này.
- Đặt **`visible: false`** để tạm ẩn hồ sơ. Đổi thành **`visible: true`** hoặc bỏ trường này để hiển thị lại. Trinh-Hoai-An Duong và Chi-Hai Cao hiện đang được tạm ẩn.
- `group` chọn nhóm hiển thị: `advisors`, `researchers`, `phd-students`, `students` (Undergraduate Students) hoặc `alumni`.
- `homepage`, `scholar`, `email` là tùy chọn; chỉ xuất hiện khi có giá trị.
- Bố cục tự xuống hàng khi thêm thành viên. Hồ sơ trong mỗi nhóm hiển thị theo thứ tự trong mảng.
- Tên file ảnh phải đúng cả chữ hoa/thường để chạy trên GitHub Pages.
- `affiliation` hiển thị trường/tổ chức dưới chức vụ. `bio`, `nativeName` có thể lưu thêm thông tin nhưng chưa hiển thị trên card.

Mảng **`memberGroups`** trong cùng file quy định tên và thứ tự nhóm. Để thêm nhóm, ví dụ **Collaborating Professors**, thêm `{ id: 'collaborators', label: 'Collaborating Professors' }`, rồi đặt `group: 'collaborators'` cho các hồ sơ tương ứng. Nhóm không có hồ sơ đang hiển thị sẽ tự ẩn; hồ sơ chưa khai báo nhóm hợp lệ sẽ nằm trong **Other members**.

## Thêm tin và giải thưởng

Thêm vào đầu mảng `news` trong `content.js`:

```javascript
{
  category: 'award', // 'publication', 'award' hoặc 'lab'
  date: '2026',
  venue: 'Tên giải thưởng hoặc sự kiện',
  title: 'Tiêu đề tiếng Anh',
  description: 'Thông tin bổ sung, nếu cần.',
  url: 'https://duong-dan-thong-bao.example/',
},
```

Trang chủ tự lấy 2 tin đầu tiên. Trang News hiển thị tiêu đề và sự kiện; bấm vào tin để đọc nguồn đầy đủ. `description` được giữ trong dữ liệu để mở rộng sau này. Mục Awards hiện chờ thông tin giải thưởng được xác nhận.

## Công bố, dự án và hội nghị

Các mảng sau đều nằm trong `content.js`. Sao chép một mục có sẵn rồi sửa:

- **`publications`**: bài báo. `id` phải duy nhất; `pdf` và `code` có thể để `null`. Danh sách tác giả đầy đủ và tóm tắt nằm trong phần **Details**. Các năm trong bộ lọc được tạo tự động.
- **`projects`**: dự án. Gồm `name`, `venue`, `description`, `icon`, `paper`, `code`. Mô tả nên giữ trong một câu.
- **`conferences`**: hội nghị. Gồm `name`, `year`, `title`, `url`, `linkLabel`, `query`. Nút **Lab papers** dùng `query` và `year` để lọc công bố.

Lưu `content.js` rồi tải lại trang. Không cần tạo lại HTML khi chỉ sửa dữ liệu.

## Chỉnh bố cục

- **`scripts/pages.mjs`**: template của 7 trang và menu/footer dùng chung.
- **`styles.css`**: màu, cỡ chữ và bố cục responsive. Nội dung chính 18px trên desktop, 17px trên điện thoại; menu desktop 16px.
- **`app.js`**: hiển thị dữ liệu, bộ lọc, tìm kiếm và menu điện thoại.
- **`brain-model.js`**: hình dạng bộ não 3D, mật độ các điểm/đường nối neural và mảng `orbitWords` chứa các chữ chạy quanh bộ não.
- **`network.js`**: vẽ lưới điểm trong suốt, chuyển động xoay/nổi nhẹ, nhịp sáng và tín hiệu chạy dọc kết nối. Các chữ chạy theo quỹ đạo nhưng luôn đứng thẳng để dễ đọc. Hiệu ứng tự dừng khi hình ra khỏi màn hình, tab bị ẩn hoặc người xem bật chế độ giảm chuyển động.
- **`images/neural-brain.svg`**: ảnh tĩnh dự phòng dùng cùng mô hình 3D; tự tạo lại khi build. Có thể chạy riêng `node scripts/brain-artwork.mjs` sau khi sửa mô hình.

Sau khi sửa template:

```powershell
npm.cmd run pages
```

Các file `.html` được sinh từ template. Sửa bố cục trong `scripts/pages.mjs` vì lệnh build sẽ tạo lại các file HTML. Nội dung liên hệ cũng nằm trong template này.

## Đưa lên GitHub Pages

1. Commit và push các file website, bao gồm 7 file `.html`, lên nhánh `main`.
2. Mở **Settings → Pages → Deploy from a branch**.
3. Chọn nhánh **main**, thư mục **/(root)** và **Save**.

URL dự kiến: https://cog-ai-lab.github.io/CogAI-Lab-Website/

Các trang dùng đường dẫn tương đối nên hoạt động dưới tên repository. Nếu đổi tên miền/repository, sửa `og:url` và `og:image` trong `scripts/pages.mjs`, rồi chạy `npm.cmd run pages`.

[Hướng dẫn GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

Để xuất thư mục riêng cho hosting khác:

```powershell
npm.cmd run build
```

Upload nội dung `dist/`. `npm.cmd run preview` xem bản build ở cổng 4173; dừng server dev trước khi dùng preview. Khi xóa ảnh trong nguồn, xóa bản tương ứng trong `dist/` trước khi upload lại.

## Kiểm tra

```powershell
npm.cmd ci
npm.cmd test
```

Test kiểm tra điều hướng 7 trang, tìm kiếm và URL bộ lọc, ảnh thiếu, tin giải thưởng, menu bàn phím, kích thước chữ, responsive và accessibility. Windows dùng Microsoft Edge. macOS/Linux cần chạy `npx playwright install chromium` trước lần kiểm tra đầu tiên.

Nguồn thông tin được ghi trong [SOURCES.md](SOURCES.md). Logo và ảnh do người dùng cung cấp; giấy phép font Manrope nằm trong `fonts/OFL.txt`.
