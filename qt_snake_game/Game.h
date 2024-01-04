#pragma once
#include <list>
#include <QObject>
#include <QTimer>
using namespace std;

enum class eDirection
{
	Left, Up, Right, Down
};

class Game : public QObject
{
	Q_OBJECT
	using Point = pair<int, int>;

public slots:
	int MainThread();

public:
	Game(size_t size);
	~Game();

	const auto& GetSnake() { return mSnake; }
	void SetDirection(int dir);
	void StartGame();
	void EndGame();
	auto GetItem() { return mItem; }

signals:
	void RefreshWindow();

private:
	void AddTail();
	void Move();
	void SetItem();
	bool IsDead();
	bool IsEatable();

	Point GetMoved(Point pt, eDirection dir);
	eDirection GetOppose(eDirection dir);

private:
	bool mbFlag;
	list<Point> mSnake;
	eDirection mDir;
	Point mItem;
	size_t mSize;
	QTimer mTimer;
};
