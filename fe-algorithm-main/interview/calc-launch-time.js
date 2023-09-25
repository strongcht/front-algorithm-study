
// 已知每个服务启动都需要一定时间，且每个服务可能依赖其他的服务启动。现给定一个n*n的二维数组arr，
// arr[i][i]表示i服务启动需要的时间，arr[i][j]表示i服务是否依赖j服务，如果为1表示依赖，
// 0表示不依赖。当服务依赖的服务彼此之间没有依赖关系时，这些服务可以并行启动。
// 题目保证服务之间不存在循环依赖关系，求服务k（1<=k<=n）启动需要的时间。

function calcLaunchTime(arr,k) {
  // 1. 生成依赖关系图
  let obj = {}
  arr.forEach((row,i)=>{
    if(i+1>k){return}
    // id:任务id
    // next:下一步的任务
    // cost:任务的执行时间
    // in: 有几个任务依赖它
    // time:任务开始时间
    obj[i] = {id:i,next:new Set(),cost:row[i],in:0,time:0}
    row.forEach((col,j)=>{
      if(i!==j && col===1){
        obj[j].next.add(i)
        obj[i].in++
      }
    })
  })
  // 就像webpack里的文件关系，入口文件->next的关系
  // 完成的任务 用来统计时间
  let compltes = []
  // in是0的 说明没有前置任务，可以并行启动
  while(true){
    let ready = []
    for(let i in obj){
      // 入口节点可能不止一个，找到他 in是0的意思，就是没有任务的.next是他
      // 没有前置任务，直接启动
      if(obj[i].in===0){
        ready.push(obj[i])
      }
    }
    if(ready.length===0){
      break // 没有可以启动的任务
    }
    // 打印一下并行的任务
    // console.log(ready.map(v=>v.id))
    ready.forEach(task=>{
      task.next.forEach(nextTask=>{
        // 任务挨个执行
        let next = obj[nextTask]
        // next的依赖项-1 等于0的话，就可以启动了
        next.in--
        // 任务的开始时间 = max(前置任务的结束时间，当前任务的开始时间)
        next.time = Math.max(task.time+task.cost,next.time)
      })
    })
    ready.forEach(task=>{
      delete obj[task.id]
      compltes.push(task)
    })
  }
  const ret = Math.max(...compltes.map(task=>task.time+task.cost))
  return ret
}

let arr1 = [
  [1, 0, 0],
  [1, 2, 0],
  [0, 1, 3]
]
//6
console.log(calcLaunchTime(arr1,3))
let arr2 = [
  [1, 0, 0, 0],
  [1, 2, 0, 0],
  [1, 1, 3, 0],
  [0, 0, 1, 4]
]
//10
console.log(calcLaunchTime(arr2,4))
let arr3 = [
  [1, 0, 0, 0],
  [1, 2, 0, 0],
  [1, 0, 3, 0],
  [0, 1, 1, 4]
]
//8
console.log(calcLaunchTime(arr3,4))

let arr4 = [
  [1, 0, 0, 0, 0, 0, 0, 0],
  [0, 2, 0, 0, 0, 0, 0, 0],
  [1, 1, 3, 0, 0, 0, 0, 0],
  [0, 0, 1, 4, 0, 0, 0, 0],
  [0, 0, 0, 1, 5, 0, 0, 0],
  [0, 0, 0, 1, 0, 6, 0, 0],
  [0, 0, 0, 0, 1, 1, 7, 0],
  [0, 0, 0, 0, 0, 0, 1, 8],
]
console.log(calcLaunchTime(arr4,8))
